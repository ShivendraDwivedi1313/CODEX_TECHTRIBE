import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const [cf, cc, lc] = await Promise.all([
      prisma.codeforcesStat.findUnique({ where: { userId } }),
      prisma.codechefStat.findUnique({ where: { userId } }),
      prisma.leetcodeStat.findUnique({ where: { userId } }),
    ])

    return NextResponse.json({
      total: (cf?.solvedQuestions || 0) + (cc?.solvedQuestions || 0) + (lc?.solvedQuestions || 0),
      codeforces: cf?.solvedQuestions || 0,
      codechef: cc?.solvedQuestions || 0,
      leetcode: lc?.solvedQuestions || 0,
    })
  } catch (error) {
    console.error('Stats GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
