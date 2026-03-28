'use client'

import Image from 'next/image'
import { TopUser } from '@/types/leaderboard'

interface Props {
  users: TopUser[]
  loading: boolean
}

const rankConfig = [
    { order: 1, size: 'w-16 h-16', ring: 'ring-border dark:ring-slate-600', badge: 'bg-skeleton text-primary dark:bg-slate-700 dark:text-slate-100', label: '2nd', glow: 'shadow-black/5 dark:shadow-none' },
    { order: 0, size: 'w-20 h-20', ring: 'ring-amber-400/30 dark:ring-amber-600/40', badge: 'bg-amber-400 text-white dark:bg-amber-600 dark:text-white', label: '1st', glow: 'shadow-amber-400/20 dark:shadow-amber-600/10' },
    { order: 2, size: 'w-16 h-16', ring: 'ring-amber-700/20 dark:ring-amber-700/40', badge: 'bg-amber-700 text-white dark:bg-amber-800 dark:text-white', label: '3rd', glow: 'shadow-amber-700/10 dark:shadow-amber-800/5' },
  ]

function SkeletonTop3() {
  return (
    <div className="flex items-end justify-center gap-6 py-6 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-skeleton" />
        <div className="h-3 w-16 bg-skeleton rounded" />
      </div>
      <div className="flex flex-col items-center gap-2 -mt-4">
        <div className="w-20 h-20 rounded-full bg-skeleton" />
        <div className="h-3 w-20 bg-skeleton rounded" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-skeleton" />
        <div className="h-3 w-16 bg-skeleton rounded" />
      </div>
    </div>
  )
}

export default function TopThreeUsers({ users, loading }: Props) {
  if (loading || users.length < 3) return <SkeletonTop3 />

  // Display order: 2nd, 1st, 3rd
  const displayOrder = [1, 0, 2]

  return (
    <div className="flex items-end justify-center gap-4 sm:gap-8 py-4">
      {displayOrder.map((userIdx, displayIdx) => {
        const user = users[userIdx]
        const config = rankConfig[displayIdx]
        const isFirst = displayIdx === 1

        return (
          <div
            key={user.id}
            className={`flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              isFirst ? '-mt-6' : 'mt-0'
            }`}
          >
            {/* Crown for #1 */}
            {isFirst && (
              <div className="text-amber-400 dark:text-amber-500 mb--1">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1l3.22 6.636 7.28 1.056-5.25 5.168 1.24 7.24L12 17.764 5.51 21.1l1.24-7.24L1.5 8.692l7.28-1.056L12 1z" />
                </svg>
              </div>
            )}

            {/* Avatar */}
            <div className="relative">
              <div className={`${config.size} rounded-full overflow-hidden ring-4 ${config.ring} shadow-xl ${config.glow}`}>
                <Image
                  src={user.avatar || 'https://picsum.photos/seed/default/200/200'}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Rank badge */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${config.badge} text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg`}>
                {config.label}
              </div>
            </div>

            {/* Info */}
            <div className="text-center mt-1">
              <p className="text-primary text-sm font-bold truncate max-w-[100px]">{user.name}</p>
              <p className="text-violet-600 text-xs font-bold">{user.score.toLocaleString()} pts</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
