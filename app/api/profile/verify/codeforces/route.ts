import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export const maxDuration = 150 // Allow up to 150 seconds for this route

export async function POST() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cfStat = await prisma.codeforcesStat.findUnique({ where: { userId } })
    if (!cfStat) {
      return NextResponse.json({ error: 'Please add your Codeforces handle first.' }, { status: 400 })
    }

    const handle = cfStat.handle
    const endpointHitTime = Math.floor(Date.now() / 1000)
    const timeoutDuration = 120 * 1000
    const pollInterval = 5 * 1000
    const startTime = Date.now()

    const expected = {
      contestId: 1765,
      name: 'Minimum LCM',
      verdict: 'TIME_LIMIT_EXCEEDED',
    }

    // Polling loop
    while (Date.now() - startTime < timeoutDuration) {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`
        )
        const data = await response.json()

        if (data.status !== 'OK') {
          await new Promise(resolve => setTimeout(resolve, pollInterval))
          continue
        }

        const submissions = data.result
        let matchedSubmission = null

        for (const sub of submissions) {
          const problem = sub.problem
          const matchByContest =
            expected.contestId &&
            problem.contestId === expected.contestId

          const matchByName =
            expected.name &&
            problem.name.toLowerCase() === expected.name.toLowerCase()

          if (matchByContest || matchByName) {
            matchedSubmission = sub
            break
          }
        }

        if (matchedSubmission) {
          const submissionTime = matchedSubmission.creationTimeSeconds
          const isSubmittedAfterHit = submissionTime > endpointHitTime
          const verdictMatch = !expected.verdict || matchedSubmission.verdict === expected.verdict
          const finalSuccess = verdictMatch && isSubmittedAfterHit

          if (finalSuccess) {
            await prisma.user.update({
              where: { id: userId },
              data: { verifiedCodeforces: true },
            })

            return NextResponse.json({
              success: true,
              submission: {
                name: matchedSubmission.problem.name,
                verdict: matchedSubmission.verdict,
              },
            })
          }
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval))
      } catch (error) {
        console.error('CF polling error:', error)
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No valid submission found within 2 minutes',
    })
  } catch (error) {
    console.error('CF verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
