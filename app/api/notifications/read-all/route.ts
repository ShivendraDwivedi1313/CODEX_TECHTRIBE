import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ success: true, message: 'All marked as read' })
  } catch (error) {
    console.error('Notifications read-all error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
