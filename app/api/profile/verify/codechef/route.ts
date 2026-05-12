import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import * as cheerio from 'cheerio'

export const maxDuration = 600

// Scrape recent submissions from a CodeChef profile using fetch + cheerio
async function scrapeSubmissions(cc_username: string): Promise<Array<{ problemCode: string; verdict: string; language: string; resultText: string }>> {
  const response = await fetch(`https://www.codechef.com/recent/user?user_handle=${cc_username}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    console.error(`[CC Verify] HTTP ${response.status} for ${cc_username}`)
    return []
  }

  const data = await response.json()
  if (!data || !data.content) return []
  const $ = cheerio.load(data.content)

  const submissions: Array<{ problemCode: string; verdict: string; language: string; resultText: string }> = []

  $('table tbody tr').slice(0, 10).each((_: number, row: any) => {
    const cells = $(row).find('td')
    if (cells.length < 3) return

    const problemCode = $(cells[1]).text().trim()
    const resultTitle = $(cells[2]).find('span').attr('title') || ''
    const resultText = resultTitle || $(cells[2]).text().trim()
    const lang = cells.length > 3 ? $(cells[3]).text().trim() : ''

    if (!problemCode) return

    let verdict = 'NOT_ACCEPTED'
    if (resultText.includes('(100)') || resultText.includes('100') || resultText.toLowerCase().includes('accepted')) {
      verdict = 'AC'
    } else if (resultText.toLowerCase().includes('wrong') || resultText.includes('WA')) {
      verdict = 'WA'
    } else if (resultText.toLowerCase().includes('time') || resultText.includes('TLE')) {
      verdict = 'TLE'
    }

    submissions.push({ problemCode, verdict, language: lang, resultText })
  })

  return submissions
}

export async function POST() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ccStat = await prisma.codechefStat.findUnique({ where: { userId } })
    if (!ccStat) {
      return NextResponse.json({ error: 'Please add your CodeChef handle first.' }, { status: 400 })
    }

    const cc_username = ccStat.handle
    console.log('Checking CodeChef submissions for:', cc_username)

    const timeoutDuration = 600 * 1000
    const pollInterval = 5 * 1000
    const startTime = Date.now()

    const expected = {
      problemCode: 'NO25PLS',
      verdict: 'AC',
    }

    // Step 1: Capture BASELINE submissions before polling starts
    let baselineCount = 0
    try {
      const baselineSubs = await scrapeSubmissions(cc_username)
      baselineCount = baselineSubs.filter(
        s => s.problemCode === expected.problemCode && s.verdict === expected.verdict
      ).length
      console.log(`[CC Verify] Baseline AC count for ${expected.problemCode}: ${baselineCount}`)
    } catch (err) {
      console.error('[CC Verify] Error getting baseline:', err)
    }

    // Step 2: Poll for NEW submissions
    while (Date.now() - startTime < timeoutDuration) {
      try {
        // Wait first before polling so user has time to submit
        await new Promise(resolve => setTimeout(resolve, pollInterval))

        const submissions = await scrapeSubmissions(cc_username)
        console.log('Scraped submissions from CodeChef:', submissions)

        if (!submissions || submissions.length === 0) {
          console.log('No submissions found, waiting...')
          continue
        }

        // Count current AC submissions for the expected problem
        const currentCount = submissions.filter(
          s => s.problemCode === expected.problemCode && s.verdict === expected.verdict
        ).length

        console.log(`[CC Verify] Current AC count: ${currentCount}, Baseline: ${baselineCount}`)

        // Only succeed if there are MORE matching submissions than at baseline
        if (currentCount > baselineCount) {
          const matchedSubmission = submissions.find(
            s => s.problemCode === expected.problemCode && s.verdict === expected.verdict
          )

          console.log('[CC Verify] NEW submission detected! Verified.')

          await prisma.user.update({
            where: { id: userId },
            data: { verifiedCodechef: true },
          })

          return NextResponse.json({
            success: true,
            problemMatched: true,
            verdictMatched: true,
            submittedAfterHit: true,
            submission: {
              problemCode: matchedSubmission?.problemCode,
              verdict: matchedSubmission?.verdict,
              language: matchedSubmission?.language,
              resultText: matchedSubmission?.resultText,
            },
          })
        }
      } catch (error) {
        console.error('Error during polling:', error)
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No valid submission found within 10 minutes',
    })
  } catch (err) {
    console.error('Verify CodeChef submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
