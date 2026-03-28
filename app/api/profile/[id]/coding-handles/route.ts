import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const handles = await prisma.user.findUnique({
      where: { id },
      select: {
        codeforcesStat: { select: { handle: true } },
        codechefStat: { select: { handle: true } },
        leetcodeStat: { select: { handle: true } },
      },
    })

    if (!handles) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      codeforces: handles.codeforcesStat?.handle || null,
      codechef: handles.codechefStat?.handle || null,
      leetcode: handles.leetcodeStat?.handle || null,
    })
  } catch (error) {
    console.error('Coding handles GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
