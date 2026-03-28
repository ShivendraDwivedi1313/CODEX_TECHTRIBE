import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { createNotification } from '@/lib/services/notifications'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: postId } = await params

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    })

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      const count = await prisma.like.count({ where: { postId } })
      return NextResponse.json({ liked: false, count })
    }

    await prisma.like.create({ data: { postId, userId } })
    const count = await prisma.like.count({ where: { postId } })

    // Notify post author
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } })
    if (post) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
      await createNotification({
        receiverId: post.authorId,
        senderId: userId,
        type: 'POST_LIKED',
        message: `${user?.name} liked your post`,
      })
    }

    return NextResponse.json({ liked: true, count })
  } catch (error) {
    console.error('Like POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
