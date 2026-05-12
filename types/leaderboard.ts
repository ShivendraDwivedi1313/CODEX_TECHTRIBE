export interface LeaderboardStats {
  techtribeScore: number
  questionCount: number
  rating: number
}

export interface TopUser {
  id: string
  name: string
  avatar?: string
  score: number
}

export interface LeaderboardUser {
  id: string
  rank: number
  name: string
  avatar?: string
  score: number
  questionsCount?: number
  rating?: number
}
