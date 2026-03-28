import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: {
          select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
        },
        _count: { select: { likes: true, comments: true } },
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    })

    const hasMore = posts.length > limit
    const results = hasMore ? posts.slice(0, limit) : posts
    const nextCursor = hasMore ? results[results.length - 1].id : null

    return NextResponse.json({
      posts: results.map((p) => ({
        id: p.id,
        image: p.imageUrl || `https://picsum.photos/seed/${p.id}/800/450`,
        title: p.title || p.content.substring(0, 60),
        description: p.content,
        likes: p._count.likes,
        authorId: p.author.id,
        authorName: p.author.name,
        authorAvatar: p.author.profile?.avatarUrl,
        liked: userId ? p.likes.length > 0 : false,
      })),
      nextCursor,
    })
  } catch (error) {
    console.error('Feed GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

