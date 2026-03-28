import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const friendships = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            profile: { select: { avatarUrl: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    })

    const friends = friendships.map((f) => {
      const u = f.senderId === userId ? f.receiver : f.sender
      return {
        id: u.id,
        name: u.name,
        username: `@${u.email.split('@')[0]}`,
        avatar: u.profile?.avatarUrl || `https://picsum.photos/seed/${u.id}/200/200`,
        rating: u.points,
        questionsCount: 0,
      }
    })

    return NextResponse.json(friends)
  } catch (error) {
    console.error('Friends GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
