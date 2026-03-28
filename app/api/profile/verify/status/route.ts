import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('userId')
    const currentUserId = await getCurrentUserId()
    const userId = targetUserId || currentUserId

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verifiedCodeforces: true,
        verifiedCodechef: true,
        verifiedLeetcode: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      codeforces: user.verifiedCodeforces,
      codechef: user.verifiedCodechef,
      leetcode: user.verifiedLeetcode,
    })
  } catch (error) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
