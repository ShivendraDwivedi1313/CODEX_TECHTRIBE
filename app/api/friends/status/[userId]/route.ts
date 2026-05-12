import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUserId = await getCurrentUserId()
    const { userId } = await params

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserId === userId) {
      return NextResponse.json({ status: 'SELF' })
    }

    const request = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      },
    })

    if (!request) {
      return NextResponse.json({ status: 'NOT_CONNECTED' })
    }

    if (request.status === 'ACCEPTED') {
      return NextResponse.json({ status: 'FRIENDS', requestId: request.id })
    }

    if (request.status === 'REJECTED') {
      return NextResponse.json({ status: 'REJECTED', requestId: request.id })
    }

    if (request.status === 'PENDING') {
      if (request.senderId === currentUserId) {
        return NextResponse.json({ status: 'REQUEST_SENT', requestId: request.id })
      } else {
        return NextResponse.json({ status: 'REQUEST_RECEIVED', requestId: request.id })
      }
    }

    return NextResponse.json({ status: 'NOT_CONNECTED' })
  } catch (error) {
    console.error('Error fetching friendship status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
