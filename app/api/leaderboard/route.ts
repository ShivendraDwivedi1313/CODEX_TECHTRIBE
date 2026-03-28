import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        points: true,
        profile: { select: { avatarUrl: true } },
        codeforcesStat: { select: { solvedQuestions: true, currentRating: true } },
        codechefStat: { select: { solvedQuestions: true, currentRating: true } },
        leetcodeStat: { select: { solvedQuestions: true, currentRating: true } },
      },
    })

    const rankedUsers = users.map((u, i) => {
      const totalQ =
        (u.codeforcesStat?.solvedQuestions || 0) +
        (u.codechefStat?.solvedQuestions || 0) +
        (u.leetcodeStat?.solvedQuestions || 0)
      const avgRating = Math.round(
        ((u.codeforcesStat?.currentRating || 0) +
          (u.codechefStat?.currentRating || 0) +
          (u.leetcodeStat?.currentRating || 0)) /
          3
      )

      return {
        id: u.id,
        rank: i + 1,
        name: u.name,
        avatar: u.profile?.avatarUrl || `https://picsum.photos/seed/${u.id}/100/100`,
        score: u.points,
        questionsCount: totalQ,
        rating: avgRating,
      }
    })

    const currentUser = rankedUsers[0]
    return NextResponse.json({
      stats: currentUser
        ? {
            techtribeScore: currentUser.score,
            questionCount: currentUser.questionsCount,
            rating: currentUser.rating,
          }
        : { techtribeScore: 0, questionCount: 0, rating: 0 },
      users: rankedUsers,
    })
  } catch (error) {
    console.error('Leaderboard GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
