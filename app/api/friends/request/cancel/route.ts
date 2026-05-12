import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId } = await req.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    // Find the request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    })

    if (!friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    if (friendRequest.senderId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to cancel this request' }, { status: 403 })
    }

    if (friendRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Can only cancel pending requests' }, { status: 400 })
    }

    // Delete the request
    await prisma.friendRequest.delete({
      where: { id: requestId },
    })

    return NextResponse.json({ success: true, message: 'Friend request cancelled' }, { status: 200 })
  } catch (error) {
    console.error('Error cancelling friend request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
