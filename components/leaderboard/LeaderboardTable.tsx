'use client'

import { LeaderboardUser } from '@/types/leaderboard'
import LeaderboardRow from './LeaderboardRow'

interface Props {
  users: LeaderboardUser[]
  loading: boolean
  currentUserId?: string
}

function SkeletonRows() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="w-8 h-4 bg-skeleton rounded" />
          <div className="w-8 h-8 rounded-full bg-skeleton" />
          <div className="flex-1 h-4 bg-surface rounded w-28" />
          <div className="w-12 h-4 bg-surface rounded" />
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardTable({ users, loading, currentUserId = 'u10' }: Props) {
  if (loading) return <SkeletonRows />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 text-[10px] uppercase tracking-wider text-muted font-bold border-b border-border">
        <div className="w-8 text-center">Rank</div>
        <div className="w-8" /> {/* avatar spacer */}
        <div className="flex-1">Name</div>
        <div className="text-right shrink-0">Score</div>
        <div className="text-right shrink-0 hidden sm:block w-16">Questions</div>
        <div className="text-right shrink-0 hidden sm:block w-14">Rating</div>
      </div>

      {/* Rows */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-hide space-y-1 py-2">
        {users.map((user) => (
          <LeaderboardRow
            key={user.id}
            user={user}
            isHighlighted={user.id === currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
