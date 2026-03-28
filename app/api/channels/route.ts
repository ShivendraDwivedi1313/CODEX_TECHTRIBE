import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get('communityId')

    if (!communityId) {
      return NextResponse.json({ message: 'Community ID is required' }, { status: 400 })
    }

    const channels = await prisma.communityChannel.findMany({
      where: { communityId },
      include: {
        _count: { select: { channelMessages: true } },
      },
    })

    return NextResponse.json(
      channels.map((ch) => ({
        id: ch.id,
        name: ch.name,
        logo: ch.logo || '💬',
        members: ch._count.channelMessages,
        categoryId: ch.communityId,
      }))
    )
  } catch (error) {
    console.error('Channels GET error:', error)
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
    const { name, logo, categoryId } = body

    const channel = await prisma.communityChannel.create({
      data: {
        name,
        logo: logo || '📢',
        communityId: categoryId,
      },
    })

    return NextResponse.json(
      {
        id: channel.id,
        name: channel.name,
        logo: channel.logo,
        members: 0,
        categoryId: channel.communityId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Channels POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
