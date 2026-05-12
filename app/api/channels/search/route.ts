import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    const channels = await prisma.communityChannel.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { community: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        _count: { select: { channelMessages: true } },
      },
      take: 10,
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
    console.error('Channel search error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
