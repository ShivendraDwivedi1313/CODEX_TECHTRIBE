export interface CodeforcesUserInfo {
  handle: string
  rating: number
  maxRating: number
  rank: string
  contribution: number
}

export async function fetchCodeforcesStats(handle: string) {
  try {
    console.log(`Fetching Codeforces stats for handle: ${handle}`)

    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`)
    const data = await res.json()

    if (data.status !== 'OK' || !data.result?.[0]) {
      console.error(`Error fetching Codeforces stats for ${handle}:`, data)
      return null
    }

    const user = data.result[0] as CodeforcesUserInfo

    // Fetch solved count from submissions
    const subRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`)
    const subData = await subRes.json()

    let solvedSet = new Set<string>()
    if (subData.status === 'OK' && Array.isArray(subData.result)) {
      for (const sub of subData.result) {
        if (sub?.verdict === 'OK' && sub.problem?.contestId && sub.problem?.index) {
          solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
        }
      }
    }

    // Fetch rating history for contest count and max rating
    const ratRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
    const ratData = await ratRes.json()
    const contests = ratData.status === 'OK' && Array.isArray(ratData.result) ? ratData.result.length : 0

    // Calculate max rating from rating history
    let maxRating = user.maxRating || 0
    if (ratData.status === 'OK' && Array.isArray(ratData.result)) {
      maxRating = ratData.result.reduce((max: number, entry: any) => 
        Math.max(max, parseInt(entry.newRating) || 0), 0
      )
    }

    const stats = {
      handle,
      solvedQuestions: solvedSet.size,
      contests,
      currentRating: user.rating || 0,
      maxRating: maxRating,
      rank: user.rank || 'Unrated',
      points: Math.round(solvedSet.size * 10 + (user.rating || 0) * 0.5),
    }

    console.log(`Successfully fetched Codeforces stats:`, stats)
    return stats
  } catch (error) {
    console.error(`Error fetching Codeforces stats for ${handle}:`, error)
    return null
  }
}
