import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('userId')
    const currentUserId = await getCurrentUserId()
    
    // Use target user ID if provided, otherwise fallback to current user
    const userId = targetUserId || currentUserId

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get stats grouped by difficulty
    const stats = await prisma.userQuestionStats.findMany({
      where: { userId, solved: true },
      include: {
        question: {
          select: { difficulty: true, title: true, slug: true },
        },
      },
      orderBy: { lastSubmittedAt: 'desc' },
    })

    const totalQuestions = await prisma.question.count()
    const byDifficulty = {
      EASY: { solved: 0, total: 0 },
      MEDIUM: { solved: 0, total: 0 },
      HARD: { solved: 0, total: 0 },
    }

    // Count totals per difficulty
    const difficultyCounts = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: { id: true },
    })
    for (const dc of difficultyCounts) {
      byDifficulty[dc.difficulty] = {
        ...byDifficulty[dc.difficulty],
        total: dc._count.id,
      }
    }

    // Count solved per difficulty
    for (const s of stats) {
      if (s.question.difficulty in byDifficulty) {
        byDifficulty[s.question.difficulty].solved++
      }
    }

    const recentSolved = stats.slice(0, 5).map(s => ({
      title: s.question.title,
      slug: s.question.slug,
      difficulty: s.question.difficulty,
      solvedAt: s.lastSubmittedAt,
    }))

    return NextResponse.json({
      totalSolved: stats.length,
      totalQuestions,
      byDifficulty,
      recentSolved,
    })
  } catch (error) {
    console.error('Error fetching question stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
