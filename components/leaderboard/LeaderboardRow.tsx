'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LeaderboardUser } from '@/types/leaderboard'

interface Props {
  user: LeaderboardUser
  isHighlighted?: boolean
}

function getRankStyle(rank: number) {
  if (rank === 1) return 'text-amber-500 font-bold'
  if (rank === 2) return 'text-muted font-bold'
  if (rank === 3) return 'text-amber-700 font-bold'
  return 'text-muted'
}

export default function LeaderboardRow({ user, isHighlighted }: Props) {
  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
        isHighlighted
          ? 'bg-violet-50 border border-violet-100 hover:bg-violet-100 dark:bg-violet-950/30 dark:border-violet-900/50 dark:hover:bg-violet-900/40'
          : 'hover:bg-surface border border-transparent'
      }`}
    >
      {/* Rank */}
      <div className={`w-8 text-center text-sm font-medium ${getRankStyle(user.rank)}`}>
        #{user.rank}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border group-hover:ring-violet-200 dark:group-hover:ring-violet-700 transition-all shadow-sm">
        <Image
          src={user.avatar || 'https://picsum.photos/seed/default/100/100'}
          alt={user.name}
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name */}
      <Link href={`/profile/${user.id}`} className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate cursor-pointer hover:text-violet-600 transition-colors ${isHighlighted ? 'text-violet-700' : 'text-primary'}`}>
          {user.name}
        </p>
      </Link>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-primary">{user.score.toLocaleString()}</p>
        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">pts</p>
      </div>

      {/* Questions */}
      <div className="text-right shrink-0 hidden sm:block w-16">
        <p className="text-sm font-semibold text-primary">{user.questionsCount}</p>
        <p className="text-[10px] text-muted uppercase tracking-tighter">solved</p>
      </div>

      {/* Rating */}
      <div className="text-right shrink-0 hidden sm:block w-14">
        <p className="text-sm font-semibold text-primary">{user.rating}</p>
        <p className="text-[10px] text-muted uppercase tracking-tighter">rating</p>
      </div>
    </div>
  )
}
