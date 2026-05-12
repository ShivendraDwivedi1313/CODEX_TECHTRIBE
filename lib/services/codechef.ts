import * as cheerio from 'cheerio'

const toNum = (t: any): number => {
  const m = String(t || '').match(/\d+/)
  return m ? Number(m[0]) : 0
}

export async function fetchCodechefStats(handle: string) {
  try {
    console.log(`[CodeChef] Fetching stats for handle: ${handle}`)

    const response = await fetch(`https://www.codechef.com/users/${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      console.error(`[CodeChef] HTTP ${response.status} for ${handle}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract current rating
    const ratingText = $('.rating-number').first().text().trim()
    const currentRating = toNum(ratingText)
    console.log(`[CodeChef] Current rating: ${currentRating}`)

    // Extract max rating from the small tag in .rating-header
    let maxRating = 0
    try {
      const maxRatingText = $('.rating-header small').first().text().trim()
      maxRating = toNum(maxRatingText)
      console.log(`[CodeChef] Max rating: ${maxRating}`)
    } catch {
      console.log(`[CodeChef] Could not extract max rating`)
    }

    // Extract problems solved and contests from h3 texts
    let problemsSolved = 0
    let contestsParticipated = 0

    try {
      const h3Texts: string[] = []
      $('.rating-data-section.problems-solved h3').each((_: number, el: any) => {
        h3Texts.push($(el).text().trim())
      })
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

    // Fallback: extract contests from .contest-participated-count
    if (contestsParticipated === 0) {
      try {
        const contestText = $('.contest-participated-count').first().text().trim()
        contestsParticipated = toNum(contestText)
        console.log(`[CodeChef] Contests from sidebar: ${contestsParticipated}`)
      } catch {
        console.log(`[CodeChef] Could not extract contest count from sidebar`)
      }
    }

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
