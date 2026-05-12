import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [cf, cc, lc] = await Promise.all([
      prisma.codeforcesStat.findUnique({ where: { userId: id } }),
      prisma.codechefStat.findUnique({ where: { userId: id } }),
      prisma.leetcodeStat.findUnique({ where: { userId: id } }),
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
