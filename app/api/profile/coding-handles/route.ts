import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { codingHandleSchema } from '@/lib/validators/profile'
import { fetchCodeforcesStats } from '@/lib/services/codeforces'
import { fetchLeetcodeStats } from '@/lib/services/leetcode'
import { fetchCodechefStats } from '@/lib/services/codechef'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = codingHandleSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 })
    }

    const { platform, handle } = validation.data

    let stats: { handle: string; solvedQuestions: number; contests: number; currentRating: number; maxRating: number; rank: string; points: number } | null = null

    console.log(`Fetching ${platform} stats for handle: ${handle}`)

    if (platform === 'CODEFORCES') {
      stats = await fetchCodeforcesStats(handle)
    } else if (platform === 'LEETCODE') {
      stats = await fetchLeetcodeStats(handle)
    } else if (platform === 'CODECHEF') {
      stats = await fetchCodechefStats(handle)
    }

    if (!stats) {
      const errorMsg = `Could not fetch stats for ${handle} on ${platform}. Please check server logs for details.`
      console.error(`[API] ${errorMsg}`)
      return NextResponse.json({ 
        message: `Could not fetch stats for ${handle} on ${platform}.\n\nPlease make sure:\n• The handle/username is correct and spelled exactly as it appears on the platform\n• Your profile is set to PUBLIC\n• The platform website is accessible (not down)\n• Try again in a few moments` 
      }, { status: 400 })
    }

    console.log(`Successfully fetched ${platform} stats:`, stats)

    const data = {
      handle: stats.handle,
      solvedQuestions: stats.solvedQuestions,
      contests: stats.contests,
      currentRating: stats.currentRating,
      maxRating: stats.maxRating,
      rank: stats.rank,
      points: stats.points,
      lastSyncedAt: new Date(),
    }

    if (platform === 'CODEFORCES') {
      await prisma.codeforcesStat.upsert({ where: { userId }, update: data, create: { userId, ...data } })
      await prisma.user.update({ where: { id: userId }, data: { verifiedCodeforces: false } })
    } else if (platform === 'LEETCODE') {
      await prisma.leetcodeStat.upsert({ where: { userId }, update: data, create: { userId, ...data } })
      await prisma.user.update({ where: { id: userId }, data: { verifiedLeetcode: false } })
    } else if (platform === 'CODECHEF') {
      await prisma.codechefStat.upsert({ where: { userId }, update: data, create: { userId, ...data } })
      await prisma.user.update({ where: { id: userId }, data: { verifiedCodechef: false } })
    }

    // Update user total points
    const [cf, cc, lc] = await Promise.all([
      prisma.codeforcesStat.findUnique({ where: { userId } }),
      prisma.codechefStat.findUnique({ where: { userId } }),
      prisma.leetcodeStat.findUnique({ where: { userId } }),
    ])
    const totalPoints = (cf?.points || 0) + (cc?.points || 0) + (lc?.points || 0)
    await prisma.user.update({ where: { id: userId }, data: { points: totalPoints } })

    return NextResponse.json({ message: `Successfully updated ${platform} handle!`, stats: data })
  } catch (error) {
    console.error('Coding handles POST error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
