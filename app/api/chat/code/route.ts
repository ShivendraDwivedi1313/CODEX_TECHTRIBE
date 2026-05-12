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
    const { conversationId, code, language } = body

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 })
    }

    const session = await prisma.chatCodeSession.upsert({
      where: { conversationId },
      update: {
        code,
        language,
        lastEditedById: userId,
      },
      create: {
        conversationId,
        code,
        language: language || 'javascript',
        lastEditedById: userId,
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating code session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
