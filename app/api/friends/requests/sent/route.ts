import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sentRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedRequests = sentRequests.map((req) => ({
      id: req.id,
      receiverId: req.receiver.id,
      name: req.receiver.name,
      username: `@${req.receiver.email.split('@')[0]}`,
      avatar: req.receiver.profile?.avatarUrl || `https://picsum.photos/seed/${req.receiver.id}/100/100`,
      createdAt: req.createdAt,
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error('Error fetching sent requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
