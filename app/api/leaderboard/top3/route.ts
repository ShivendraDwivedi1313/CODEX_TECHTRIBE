import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        points: true,
        profile: { select: { avatarUrl: true } },
      },
    })

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.profile?.avatarUrl || `https://picsum.photos/seed/${u.id}/200/200`,
        score: u.points,
      }))
    )
  } catch (error) {
    console.error('Top3 GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
