import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { friendId } = await req.json()

    if (!friendId) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 })
    }

    // Delete the friendship (which is an ACCEPTED FriendRequest)
    await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId, status: 'ACCEPTED' },
          { senderId: friendId, receiverId: userId, status: 'ACCEPTED' },
        ],
      },
    })

    return NextResponse.json({ success: true, message: 'Friend removed' }, { status: 200 })
  } catch (error) {
    console.error('Error removing friend:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
