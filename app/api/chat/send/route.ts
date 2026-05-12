import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, content, type, language } = body

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify participation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const participant = conversation.participants.find(p => p.userId === userId)
    if (!participant) {
      return NextResponse.json({ error: 'Not a participant of this conversation' }, { status: 403 })
    }

    // Validate friendship
    const otherParticipant = conversation.participants.find(p => p.userId !== userId)
    if (otherParticipant) {
      const isFriend = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: otherParticipant.userId, status: 'ACCEPTED' },
            { senderId: otherParticipant.userId, receiverId: userId, status: 'ACCEPTED' },
          ],
        },
      })

      if (!isFriend) {
        return NextResponse.json({ error: 'Must be friends to send messages' }, { status: 403 })
      }
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: userId,
        content,
        type: type || 'TEXT',
        language: language || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, profile: { select: { avatarUrl: true } } }
        }
      }
    })

    // Create Notification for the receiver
    if (otherParticipant) {
      await prisma.notification.create({
        data: {
          receiverId: otherParticipant.userId,
          senderId: userId,
          type: 'NEW_MESSAGE',
          message: 'sent you a new message.',
        },
      })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
