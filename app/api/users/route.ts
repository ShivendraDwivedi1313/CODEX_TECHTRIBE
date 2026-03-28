import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')?.toLowerCase() || ''
    const currentUserId = await getCurrentUserId()

    // Base users query
    const usersPromise = prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { profile: { skills: { hasSome: [query] } } },
            ],
          }
        : {},
      take: 20,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        profile: { select: { avatarUrl: true } },
        _count: { select: { posts: true } },
      },
    })

    // Followers query (who the current user is following)
    const followingPromise = currentUserId 
      ? prisma.follow.findMany({
          where: { followerId: currentUserId, status: 'ACCEPTED' },
          select: { followingId: true }
        })
      : Promise.resolve([])

    const [users, following] = await Promise.all([usersPromise, followingPromise])
    
    // Create a Set for O(1) lookup
    const followingSet = new Set(following.map(f => f.followingId))

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        username: `@${u.email.split('@')[0]}`,
        avatar: u.profile?.avatarUrl || `https://picsum.photos/seed/${u.id}/100/100`,
        rating: u.points,
        questionsCount: u._count.posts,
        isFriend: followingSet.has(u.id),
      }))
    )
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
