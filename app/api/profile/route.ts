import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { updateProfileSchema } from '@/lib/validators/profile'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 20 reads per minute
    const rl = rateLimit(`profile-get:${userId}`, { limit: 20, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        createdAt: true,
        profile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: `@${user.email.split('@')[0]}`,
      avatar: user.profile?.avatarUrl || `https://picsum.photos/seed/${user.id}/200/200`,
      bio: user.profile?.bio || '',
      joinedDate: user.createdAt.toISOString().split('T')[0],
      points: user.points,
      headline: user.profile?.headline,
      college: user.profile?.college,
      company: user.profile?.company,
      location: user.profile?.location,
      website: user.profile?.website,
      githubUrl: user.profile?.githubUrl,
      linkedinUrl: user.profile?.linkedinUrl,
      portfolioUrl: user.profile?.portfolioUrl,
      skills: user.profile?.skills || [],
      interests: user.profile?.interests || [],
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 updates per minute
    const rl = rateLimit(`profile-put:${userId}`, { limit: 10, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { message: 'Too many updates. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, ...profileData } = validation.data

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      })
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
