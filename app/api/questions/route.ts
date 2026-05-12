import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const tag = searchParams.get('tag') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const userId = await getCurrentUserId()

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }
    if (difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())) {
      where.difficulty = difficulty.toUpperCase()
    }
    if (tag) {
      where.tags = { has: tag }
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          timeLimit: true,
          createdAt: true,
          // Include solved status for current user
          ...(userId ? {
            stats: {
              where: { userId },
              select: { solved: true, attempts: true, bestVerdict: true },
            },
          } : {}),
        },
        orderBy: [
          { difficulty: 'asc' },
          { title: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.question.count({ where }),
    ])

    // Flatten stats for easier frontend consumption
    const result = questions.map((q: any) => ({
      ...q,
      solved: q.stats?.[0]?.solved ?? false,
      attempts: q.stats?.[0]?.attempts ?? 0,
      bestVerdict: q.stats?.[0]?.bestVerdict ?? null,
      stats: undefined,
    }))

    return NextResponse.json({ questions: result, total, page, limit })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
