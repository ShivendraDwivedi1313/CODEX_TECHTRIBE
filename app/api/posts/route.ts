import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { createPostSchema } from '@/lib/validators/post'
import { saveUploadedFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const imageFile = formData.get('image') as File | null
    const projectLink = formData.get('projectLink') as string || undefined
    const achievement = formData.get('achievement') as string || undefined
    const communityId = formData.get('communityId') as string || undefined

    let imageUrl: string | undefined

    // Save image to local filesystem instead of Base64
    if (imageFile) {
      imageUrl = await saveUploadedFile(imageFile)
    }

    const validation = createPostSchema.safeParse({
      title,
      content,
      imageUrl: imageUrl || undefined,
      projectLink,
      achievement,
      communityId,
    })

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 })
    }

    const { title: validTitle, content: validContent, imageUrl: validImageUrl, projectLink: validProjectLink, achievement: validAchievement, communityId: validCommunityId } = validation.data

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        title: validTitle,
        content: validContent,
        imageUrl: validImageUrl || null,
        projectLink: validProjectLink || null,
        achievement: validAchievement || null,
        isCommunityPost: !!validCommunityId,
        communityId: validCommunityId || null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Posts POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    })

    const hasMore = posts.length > limit
    const results = hasMore ? posts.slice(0, limit) : posts
    const nextCursor = hasMore ? results[results.length - 1].id : null

    return NextResponse.json({ posts: results, nextCursor })
  } catch (error) {
    console.error('Posts GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
