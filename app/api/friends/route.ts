import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserId = session.user.id

    const friendships = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: currentUserId, status: 'ACCEPTED' },
          { receiverId: currentUserId, status: 'ACCEPTED' },
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
            _count: { select: { posts: true } }
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            points: true,
            profile: { select: { avatarUrl: true } },
            _count: { select: { posts: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      friendships.map((f) => {
        const u = f.senderId === currentUserId ? f.receiver : f.sender
        return {
          id: u.id,
          name: u.name,
          username: `@${u.email.split('@')[0]}`,
          avatar: u.profile?.avatarUrl || `https://picsum.photos/seed/${u.id}/100/100`,
          rating: u.points,
          questionsCount: u._count.posts,
          isFriend: true,
        }
      })
    )
  } catch (error) {
    console.error('Friends GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
