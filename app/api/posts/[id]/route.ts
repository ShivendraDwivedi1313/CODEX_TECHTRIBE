import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatarUrl: true } },
          },
        },
        _count: { select: { likes: true } },
      },
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: post.id,
      title: post.title || post.content.substring(0, 60),
      description: post.content,
      image: post.imageUrl || `https://picsum.photos/seed/${post.id}/800/450`,
      authorId: post.author.id,
      authorName: post.author.name,
      authorAvatar: post.author.profile?.avatarUrl,
      likes: post._count.likes,
      createdAt: post.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Post GET error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Post DELETE error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
