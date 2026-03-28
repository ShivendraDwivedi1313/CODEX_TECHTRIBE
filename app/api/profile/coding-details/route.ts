import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export interface PlatformStats {
  platform: 'CODEFORCES' | 'CODECHEF' | 'LEETCODE'
  contests: number
  questions: number
  currentRating?: number
  maxRating?: number
  points?: number
  rank?: string
}

export interface CodingDetailsResponse {
  totalQuestions: number
  totalContests: number
  totalScore?: number
  platforms: PlatformStats[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const requestedUserId = searchParams.get('userId')

    let userId = requestedUserId
    if (!userId) {
      userId = await getCurrentUserId()
      if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
    }

    const [cf, cc, lc] = await Promise.all([
      prisma.codeforcesStat.findUnique({ where: { userId } }),
      prisma.codechefStat.findUnique({ where: { userId } }),
      prisma.leetcodeStat.findUnique({ where: { userId } }),
    ])

    const platforms: PlatformStats[] = [
      {
        platform: 'LEETCODE',
        contests: lc?.contests || 0,
        questions: lc?.solvedQuestions || 0,
        points: lc?.points || 0,
        rank: lc?.rank || 'Unrated',
      },
      {
        platform: 'CODECHEF',
        contests: cc?.contests || 0,
        questions: cc?.solvedQuestions || 0,
        currentRating: cc?.currentRating || 0,
        maxRating: cc?.maxRating || 0,
        rank: cc?.rank || 'Unrated',
      },
      {
        platform: 'CODEFORCES',
        contests: cf?.contests || 0,
        questions: cf?.solvedQuestions || 0,
        currentRating: cf?.currentRating || 0,
        maxRating: cf?.maxRating || 0,
        rank: cf?.rank || 'Unrated',
      },
    ]

    const response: CodingDetailsResponse = {
      totalQuestions: platforms.reduce((sum, p) => sum + p.questions, 0),
      totalContests: platforms.reduce((sum, p) => sum + p.contests, 0),
      totalScore: (cf?.points || 0) + (cc?.points || 0) + (lc?.points || 0),
      platforms,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Coding details GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
