import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const receivedRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
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

    const formattedRequests = receivedRequests.map((req) => ({
      id: req.id,
      senderId: req.sender.id,
      name: req.sender.name,
      username: `@${req.sender.email.split('@')[0]}`,
      avatar: req.sender.profile?.avatarUrl || `https://picsum.photos/seed/${req.sender.id}/100/100`,
      createdAt: req.createdAt,
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error('Error fetching received requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
