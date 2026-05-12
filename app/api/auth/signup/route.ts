import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { signupSchema } from '@/lib/validators/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 signups per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rl = rateLimit(`signup:${ip}`, { limit: 5, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { message: 'Too many signup attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    const validation = signupSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: '',
            avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(
      { message: 'Account created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
