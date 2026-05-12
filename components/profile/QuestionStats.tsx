'use client'

import Link from 'next/link'
import type { QuestionStatsData } from './QuestionWheel'

interface QuestionStatsProps {
  stats: QuestionStatsData | null
  loading: boolean
  userId?: string
}

interface StatCardProps {
  label: string
  value: number
  color: string
  bgColor: string
}

function StatCard({ label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.03] ${bgColor} ${color}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  )
}

function SkeletonStats() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-skeleton rounded-xl" />
      ))}
      <div className="h-10 bg-surface rounded-xl mt-2" />
    </div>
  )
}

export default function QuestionStats({ stats, loading, userId }: QuestionStatsProps) {
  if (loading || !stats) return <SkeletonStats />

  const statsLink = userId ? `/profile/${userId}/stats` : '/profile/stats'

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Edit settings */}
      <button className="absolute -top-1 -right-1 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-border transition-all duration-200" title="Edit Settings">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>

      {/* Stat cards */}
      <StatCard
        label="LC Questions"
        value={stats.leetcode}
        color="text-violet-600"
        bgColor="bg-violet-50 border-violet-100"
      />
      <StatCard
        label="CC Questions"
        value={stats.codechef}
        color="text-emerald-600"
        bgColor="bg-emerald-50 border-emerald-100"
      />
      <StatCard
        label="CF Questions"
        value={stats.codeforces}
        color="text-amber-600"
        bgColor="bg-amber-50 border-amber-100"
      />

      {/* Details button */}
      <Link href={statsLink} className="mt-2 block w-full">
        <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-secondary bg-surface border border-border hover:bg-border hover:text-primary hover:border-border transition-all duration-200 text-center">
          View Details →
        </button>
      </Link>
    </div>
  )
}
