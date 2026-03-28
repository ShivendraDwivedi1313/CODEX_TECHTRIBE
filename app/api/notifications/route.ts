import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        sender: { select: { id: true, name: true, profile: { select: { avatarUrl: true } } } },
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ message: 'Marked as read' })
  } catch (error) {
    console.error('Notifications PUT error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
