import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const joinable = searchParams.get('joinable')

    if (joinable === 'true') {
      const userId = await getCurrentUserId()
      const communities = await prisma.community.findMany({
        where: userId
          ? { members: { none: { userId } } }
          : {},
        take: 20,
        include: { _count: { select: { members: true, channels: true } } },
      })

      return NextResponse.json(
        communities.map((c) => ({
          id: c.id,
          name: c.name,
          logo: c.imageUrl || '📢',
          members: c._count.members,
          categoryId: c.id,
        }))
      )
    }

    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true },
    })

    return NextResponse.json(communities)
  } catch (error) {
    console.error('Communities GET error:', error)
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
    const community = await prisma.community.create({
      data: {
        name: body.name,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        creatorId: userId,
        members: { create: { userId, role: 'OWNER' } },
      },
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    console.error('Communities POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
