import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params

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

    const session = await prisma.chatCodeSession.findUnique({
      where: { conversationId },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching code session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
