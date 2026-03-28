import puppeteer from 'puppeteer'

const toNum = (t: any): number => {
  const m = String(t || '').match(/\d+/)
  return m ? Number(m[0]) : 0
}

export async function fetchCodechefStats(handle: string) {
  let browser
  try {
    console.log(`[CodeChef] Fetching stats for handle: ${handle}`)

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()

    await page.goto(`https://www.codechef.com/users/${handle}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for the rating number to appear (JS-rendered content)
    await page.waitForSelector('.rating-number', { timeout: 15000 })

    // Extract current rating
    const ratingText = await page.$eval('.rating-number', (el: Element) =>
      (el as HTMLElement).innerText.trim()
    )
    const currentRating = toNum(ratingText)
    console.log(`[CodeChef] Current rating: ${currentRating}`)

    // Extract max rating from the small tag in .rating-header
    let maxRating = 0
    try {
      const maxRatingText = await page.$eval('.rating-header small', (el: Element) =>
        (el as HTMLElement).innerText.trim()
      )
      maxRating = toNum(maxRatingText)
      console.log(`[CodeChef] Max rating: ${maxRating}`)
    } catch {
      console.log(`[CodeChef] Could not extract max rating`)
    }

    // Extract problems solved and contests
    // The h3 elements in .rating-data-section.problems-solved are:
    //   "Learning Paths (N)", "Practice Paths (N)", "Contests (N)", "Total Problems Solved: N"
    let problemsSolved = 0
    let contestsParticipated = 0

    // Method 1: Extract from h3 texts by matching labels
    try {
      const h3Texts = await page.$$eval(
        '.rating-data-section.problems-solved h3',
        (els: Element[]) => els.map((el: Element) => (el as HTMLElement).innerText.trim())
      )
      console.log(`[CodeChef] Found h3 texts:`, h3Texts)

      for (const text of h3Texts) {
        if (text.toLowerCase().startsWith('total problems solved')) {
          problemsSolved = toNum(text)
          console.log(`[CodeChef] Problems solved: ${problemsSolved}`)
        } else if (text.toLowerCase().startsWith('contests')) {
          contestsParticipated = toNum(text)
          console.log(`[CodeChef] Contests from h3: ${contestsParticipated}`)
        }
      }
    } catch (e) {
      console.log(`[CodeChef] Could not extract from h3 elements: ${e}`)
    }

    // Method 2: Fallback – extract contests from .contest-participated-count
    if (contestsParticipated === 0) {
      try {
        const contestText = await page.$eval(
          '.contest-participated-count',
          (el: Element) => (el as HTMLElement).innerText.trim()
        )
        contestsParticipated = toNum(contestText)
        console.log(`[CodeChef] Contests from sidebar: ${contestsParticipated}`)
      } catch {
        console.log(`[CodeChef] Could not extract contest count from sidebar`)
      }
    }

    await browser.close()
    browser = null

    // Validate we got at least some data
    if (currentRating === 0 && maxRating === 0 && problemsSolved === 0) {
      console.error(`[CodeChef] No meaningful data extracted for ${handle}`)
      return null
    }

    const stats = {
      handle,
      solvedQuestions: problemsSolved,
      contests: contestsParticipated,
      currentRating,
      maxRating: maxRating || currentRating,
      rank: getRankFromRating(currentRating),
      points: Math.round(
        (currentRating || 0) * 0.8 + (contestsParticipated || 0) * 5
      ),
    }

    console.log(`[CodeChef] Successfully fetched stats:`, stats)
    return stats
  } catch (error) {
    console.error(`[CodeChef] Error fetching stats:`, error)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

function getRankFromRating(rating: number): string {
  if (rating >= 2100) return '★★★★★'
  else if (rating >= 1800) return '★★★★'
  else if (rating >= 1600) return '★★★'
  else if (rating >= 1400) return '★★'
  else if (rating >= 1200) return '★'
  return 'Unrated'
}
