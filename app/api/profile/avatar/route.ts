import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { saveUploadedFile } from '@/lib/upload'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 5 avatar uploads per 5 minutes
    const rl = rateLimit(`avatar:${userId}`, { limit: 5, windowSeconds: 300 })
    if (!rl.success) {
      return NextResponse.json(
        { message: 'Too many uploads. Please wait a few minutes.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        }
      )
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const file = formData.get('avatar') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type. Use JPG, PNG, GIF, or WebP.' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'File too large. Max 5MB.' }, { status: 400 })
    }

    const avatarUrl = await saveUploadedFile(file)

    // Upsert the profile with the new avatar URL
    await prisma.profile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: { userId, avatarUrl },
    })

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
