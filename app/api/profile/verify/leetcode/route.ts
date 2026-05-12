import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export const maxDuration = 150

export async function POST() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lcStat = await prisma.leetcodeStat.findUnique({ where: { userId } })
    if (!lcStat) {
      return NextResponse.json({ error: 'Please add your LeetCode handle first.' }, { status: 400 })
    }

    const username = lcStat.handle
    const endpointHitTime = Math.floor(Date.now() / 1000)
    const timeoutDuration = 120 * 1000
    const pollInterval = 5 * 1000
    const startTime = Date.now()

    const expected = {
      titleSlug: 'two-sum',
      status: 'Accepted',
    }

    const GRAPHQL_URL = 'https://leetcode.com/graphql/'

    async function graphqlRequest(query: string, variables: Record<string, any> = {}) {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'referer': 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables }),
      })
      const json = await res.json()
      if (json.errors) {
        throw new Error(JSON.stringify(json.errors))
      }
      return json.data
    }

    // Polling loop
    while (Date.now() - startTime < timeoutDuration) {
      try {
        const query = `
          query recentSubmissions($username: String!) {
            recentSubmissionList(username: $username, limit: 10) {
              title
              titleSlug
              timestamp
              statusDisplay
              lang
            }
          }
        `

        const data = await graphqlRequest(query, { username })

        if (!data || !data.recentSubmissionList) {
          await new Promise(resolve => setTimeout(resolve, pollInterval))
          continue
        }

        const submissions = data.recentSubmissionList
        let matchedSubmission = null

        for (const sub of submissions) {
          if (expected.titleSlug && sub.titleSlug === expected.titleSlug) {
            matchedSubmission = sub
            break
          }
        }

        if (matchedSubmission) {
          const submissionTime = Math.floor(matchedSubmission.timestamp)
          const isSubmittedAfterHit = submissionTime > endpointHitTime
          const statusMatch = !expected.status || matchedSubmission.statusDisplay === expected.status
          const finalSuccess = statusMatch && isSubmittedAfterHit

          if (finalSuccess) {
            await prisma.user.update({
              where: { id: userId },
              data: { verifiedLeetcode: true },
            })

            return NextResponse.json({
              success: true,
              submission: {
                title: matchedSubmission.title,
                status: matchedSubmission.statusDisplay,
              },
            })
          }
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval))
      } catch (error) {
        console.error('LC polling error:', error)
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No valid submission found within 2 minutes',
    })
  } catch (error) {
    console.error('LC verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
