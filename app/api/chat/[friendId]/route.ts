import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    const { friendId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (userId === friendId) {
      return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 })
    }

    // Ensure they are friends
    const isFriend = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId, status: 'ACCEPTED' },
          { senderId: friendId, receiverId: userId, status: 'ACCEPTED' },
        ],
      },
    })

    if (!isFriend) {
      return NextResponse.json({ error: 'Must be friends to chat' }, { status: 403 })
    }

    // Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userId } } },
          { participants: { some: { userId: friendId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, profile: { select: { avatarUrl: true } } } }
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, profile: { select: { avatarUrl: true } } } }
          }
        },
        codeSession: true,
      },
    })

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: userId },
              { userId: friendId },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: { select: { id: true, name: true, profile: { select: { avatarUrl: true } } } }
            }
          },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: { select: { id: true, name: true, profile: { select: { avatarUrl: true } } } }
            }
          },
          codeSession: true,
        },
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
