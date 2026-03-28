'use client'

import { LeaderboardStats as StatsType } from '@/types/leaderboard'

interface Props {
  stats: StatsType | null
  loading: boolean
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.03] shadow-sm dark:shadow-none ${color} dark:bg-slate-900/50 dark:border-slate-700`}>
      <div className="w-11 h-11 rounded-xl bg-card flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">{value.toLocaleString()}</p>
        <p className="text-xs text-secondary mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-skeleton rounded-2xl" />
      ))}
    </div>
  )
}

export default function LeaderboardStatsSection({ stats, loading }: Props) {
  if (loading || !stats) return <SkeletonStats />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="TechTribe Score"
        value={stats.techtribeScore}
        color="bg-violet-50 border-violet-100 dark:bg-violet-950/40 dark:border-violet-900/50"
        icon={
          <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        }
      />
      <StatCard
        label="Questions Solved"
        value={stats.questionCount}
        color="bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50"
        icon={
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="Contest Rating"
        value={stats.rating}
        color="bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50"
        icon={
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        }
      />
    </div>
  )
}
