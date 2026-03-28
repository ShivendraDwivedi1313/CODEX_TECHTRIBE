import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId } = await req.json()

    if (!receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 })
    }

    if (userId === receiverId) {
      return NextResponse.json({ error: 'Cannot send a friend request to yourself' }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
    if (!receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if request already exists in either direction
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
    })

    if (existingRequest) {
      if (existingRequest.status === 'ACCEPTED') {
         return NextResponse.json({ error: 'You are already friends' }, { status: 400 })
      }
      
      // If there is a PENDING request...
      if (existingRequest.status === 'PENDING') {
        if (existingRequest.senderId === userId) {
           return NextResponse.json({ error: 'Friend request already sent' }, { status: 400 })
        } else {
           return NextResponse.json({ error: 'User has already sent you a request. Please accept it instead.' }, { status: 400 })
        }
      }

      // If it's REJECTED, we can reuse it by updating it to PENDING and swapping sender/receiver if necessary
      if (existingRequest.status === 'REJECTED') {
        await prisma.friendRequest.update({
          where: { id: existingRequest.id },
          data: {
            senderId: userId,
            receiverId: receiverId,
            status: 'PENDING',
          },
        })

        // Trigger Notification
        await prisma.notification.create({
          data: {
            receiverId: receiverId,
            senderId: userId,
            type: 'FRIEND_REQUEST',
            message: 'sent you a friend request.',
          },
        })

        return NextResponse.json({ success: true, message: 'Friend request sent' }, { status: 200 })
      }
    }

    // Create Friend Request
    await prisma.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: receiverId,
        status: 'PENDING',
      },
    })

    // Trigger Notification
    await prisma.notification.create({
      data: {
        receiverId: receiverId,
        senderId: userId,
        type: 'FRIEND_REQUEST',
        message: 'sent you a friend request.',
      },
    })

    return NextResponse.json({ success: true, message: 'Friend request sent' }, { status: 200 })
  } catch (error) {
    console.error('Error sending friend request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
