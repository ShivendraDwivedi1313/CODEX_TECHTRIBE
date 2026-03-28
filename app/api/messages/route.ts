import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId') || ''

    if (!channelId) {
      return NextResponse.json([])
    }

    const messages = await prisma.channelMessage.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })

    return NextResponse.json(
      messages.map((m) => ({
        id: m.id,
        user: m.userName,
        text: m.content,
        timestamp: m.createdAt.toISOString(),
        channelId: m.channelId,
      }))
    )
  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const channelId = body.channelId
    const text = body.text

    if (!channelId || !text) {
      return NextResponse.json({ message: 'channelId and text required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })

    const message = await prisma.channelMessage.create({
      data: {
        channelId,
        userId,
        userName: user?.name || 'Anonymous',
        content: text,
      },
    })

    return NextResponse.json(
      {
        id: message.id,
        user: message.userName,
        text: message.content,
        timestamp: message.createdAt.toISOString(),
        channelId: message.channelId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Messages POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
