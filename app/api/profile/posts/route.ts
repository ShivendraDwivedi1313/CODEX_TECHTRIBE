import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const requestedUserId = searchParams.get('userId')

    // If a specific user is requested, fetch their posts
    if (requestedUserId) {
      const posts = await prisma.post.findMany({
        where: { authorId: requestedUserId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { likes: true, comments: true } },
        },
      })

      return NextResponse.json(
        posts.map((p) => ({
          id: p.id,
          image: p.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`,
          title: p.title || p.content.substring(0, 60),
          description: p.content,
          likes: p._count.likes,
          comments: p._count.comments,
        }))
      )
    }

    // Otherwise, fetch current user's posts
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { likes: true, comments: true } },
      },
    })

    return NextResponse.json(
      posts.map((p) => ({
        id: p.id,
        image: p.imageUrl || `https://picsum.photos/seed/${p.id}/600/400`,
        title: p.title || p.content.substring(0, 60),
        description: p.content,
        likes: p._count.likes,
        comments: p._count.comments,
      }))
    )
  } catch (error) {
    console.error('Profile posts GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
