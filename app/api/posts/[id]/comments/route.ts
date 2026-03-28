import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { createCommentSchema } from '@/lib/validators/post'
import { createNotification } from '@/lib/services/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comments GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: postId } = await params
    const body = await request.json()
    const validation = createCommentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: { postId, authorId: userId, content: validation.data.content },
      include: {
        author: {
          select: { id: true, name: true, profile: { select: { avatarUrl: true } } },
        },
      },
    })

    // Notify post author
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } })
    if (post) {
      await createNotification({
        receiverId: post.authorId,
        senderId: userId,
        type: 'POST_COMMENTED',
        message: `${comment.author.name} commented on your post`,
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comments POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
