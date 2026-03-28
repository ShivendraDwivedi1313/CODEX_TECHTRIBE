export async function fetchLeetcodeStats(handle: string) {
  try {
    console.log(`[LeetCode] Fetching stats for: ${handle}`)

    const GRAPHQL_URL = 'https://leetcode.com/graphql/'

    async function graphqlRequest(query: string, variables: any = {}) {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'referer': 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables }),
      })

      const json = await res.json()
      if (json.errors) throw new Error(JSON.stringify(json.errors))
      return json.data
    }

    const query = `
    query getLeetCodeStats($username: String!) {
      user: matchedUser(username: $username) {
        stats: submitStatsGlobal {
          accepted: acSubmissionNum {
            difficulty
            count
          }
        }
      }
      currentRank: userContestRanking(username: $username) {
        contests: attendedContestsCount
        rating
      }
      history: userContestRankingHistory(username: $username) {
        rating
      }
    }`

    const d = await graphqlRequest(query, { username: handle })

    const totalSolved = d?.user?.stats?.accepted?.find(
      (x: any) => x.difficulty === 'All'
    )?.count ?? 0

    const easySolved = d?.user?.stats?.accepted?.find(
      (x: any) => x.difficulty === 'Easy'
    )?.count ?? 0

    const mediumSolved = d?.user?.stats?.accepted?.find(
      (x: any) => x.difficulty === 'Medium'
    )?.count ?? 0

    const hardSolved = d?.user?.stats?.accepted?.find(
      (x: any) => x.difficulty === 'Hard'
    )?.count ?? 0

    const currentRating = d?.currentRank?.rating ?? null
    const contests = d?.currentRank?.contests ?? 0
    const points = easySolved + mediumSolved * 2 + hardSolved * 3

    const ratings = Array.isArray(d?.history)
      ? d.history.map((h: any) => h?.rating).filter((r: any) => typeof r === 'number')
      : []
    const maxRating = ratings.length ? Math.max(...ratings) : null

    console.log(`[LeetCode] Successfully fetched stats`)

    return {
      handle,
      solvedQuestions: totalSolved,
      contests,
      currentRating: currentRating || 0,
      maxRating: maxRating || currentRating || 0,
      rank: getRankFromRating(currentRating || 0),
      points: points,
    }
  } catch (error) {
    console.error(`[LeetCode] Error:`, error)
    return null
  }
}

function getRankFromRating(rating: number): string {
  if (rating >= 2400) return 'Guardian'
  else if (rating >= 2000) return 'Knight'
  else if (rating >= 1600) return 'Warrior'
  else if (rating > 0) return 'Contender'
  return 'Unrated'
}
