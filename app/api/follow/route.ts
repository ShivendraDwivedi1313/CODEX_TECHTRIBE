import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { createNotification } from '@/lib/services/notifications'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()
    if (!followingId || followingId === userId) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId } },
    })

    if (existing) {
      return NextResponse.json({ message: 'Follow request already exists', status: existing.status })
    }

    const follow = await prisma.follow.create({
      data: { followerId: userId, followingId, status: 'ACCEPTED' },
    })

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
    await createNotification({
      receiverId: followingId,
      senderId: userId,
      type: 'FOLLOW_REQUEST',
      message: `${user?.name} started following you`,
    })

    return NextResponse.json(follow, { status: 201 })
  } catch (error) {
    console.error('Follow POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()

    await prisma.follow.deleteMany({
      where: { followerId: userId, followingId },
    })

    return NextResponse.json({ message: 'Unfollowed' })
  } catch (error) {
    console.error('Follow DELETE error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('userId') || userId

    const [followers, following] = await Promise.all([
      prisma.follow.count({ where: { followingId: targetId, status: 'ACCEPTED' } }),
      prisma.follow.count({ where: { followerId: targetId, status: 'ACCEPTED' } }),
    ])

    let isFollowing = false
    if (targetId !== userId) {
      const exists = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: targetId } },
      })
      isFollowing = exists?.status === 'ACCEPTED'
    }

    return NextResponse.json({ followers, following, isFollowing })
  } catch (error) {
    console.error('Follow GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
