import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { updateProfileSchema } from '@/lib/validators/profile'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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

    const body = await request.json()
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: validation.data,
      create: { userId, ...validation.data },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
