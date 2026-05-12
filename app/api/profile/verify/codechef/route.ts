import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import puppeteer from 'puppeteer'

export const maxDuration = 150

// Scrape recent submissions from a CodeChef profile
async function scrapeSubmissions(cc_username: string): Promise<Array<{ problemCode: string; verdict: string; language: string; resultText: string }>> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.goto(`https://www.codechef.com/users/${cc_username}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    const submissions = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'))
      return rows.slice(0, 10).map(row => {
        const cells = row.querySelectorAll('td')
        if (cells.length < 3) return null

        const problemCode = cells[1]?.innerText?.trim() || ''
        const resultText = cells[2]?.innerText?.trim() || ''
        const lang = cells[3]?.innerText?.trim() || ''

        let verdict = 'NOT_ACCEPTED'
        if (resultText.includes('(100)') || resultText.includes('100') || resultText.toLowerCase().includes('accepted')) {
          verdict = 'AC'
        } else if (resultText.includes('Wrong') || resultText.includes('WA')) {
          verdict = 'WA'
        } else if (resultText.includes('Time') || resultText.includes('TLE')) {
          verdict = 'TLE'
        }

        return {
          problemCode,
          verdict,
          language: lang,
          resultText,
        }
      }).filter(sub => sub && sub.problemCode)
    })

    return (submissions || []).filter(Boolean) as Array<{ problemCode: string; verdict: string; language: string; resultText: string }>
  } finally {
    await browser.close()
  }
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

    const timeoutDuration = 120 * 1000
    const pollInterval = 5 * 1000
    const startTime = Date.now()

    const expected = {
      problemCode: 'NO25PLS',
      verdict: 'AC',
    }

    // Step 1: Capture BASELINE submissions before polling starts
    // This is the key fix — we record what already exists so we don't count old submissions
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
      message: 'No valid submission found within 2 minutes',
    })
  } catch (err) {
    console.error('Verify CodeChef submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
