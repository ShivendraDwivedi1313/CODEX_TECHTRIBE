'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DifficultyBadge } from './Badges'

interface QuestionStats {
  totalSolved: number
  totalQuestions: number
  byDifficulty: {
    EASY: { solved: number; total: number }
    MEDIUM: { solved: number; total: number }
    HARD: { solved: number; total: number }
  }
  recentSolved: { title: string; slug: string; difficulty: string; solvedAt: string }[]
}

export default function QuestionStatsCard({ userId }: { userId?: string }) {
  const [stats, setStats] = useState<QuestionStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = userId ? `/api/questions/stats?userId=${userId}` : '/api/questions/stats'
        const res = await fetch(url)
        if (res.ok) setStats(await res.json())
      } catch {}
    }
    fetchStats()
  }, [])

  if (!stats) return null

  const diffColors = {
    EASY: 'text-emerald-600 dark:text-emerald-400',
    MEDIUM: 'text-amber-600 dark:text-amber-400',
    HARD: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          Coding Progress
        </h3>
        <Link href="/questions" className="text-xs text-violet-600 hover:underline font-medium">
          View All →
        </Link>
      </div>

      {/* Overall progress */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle className="text-border" stroke="currentColor" fill="none" strokeWidth="3" cx="18" cy="18" r="15.5" />
            <circle
              className="text-violet-600"
              stroke="currentColor"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              cx="18" cy="18" r="15.5"
              strokeDasharray={`${(stats.totalSolved / Math.max(stats.totalQuestions, 1)) * 97.5} 97.5`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{stats.totalSolved}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
            <div key={d} className="flex items-center gap-2">
              <span className={`text-xs font-semibold w-16 ${diffColors[d]}`}>{d}</span>
              <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d === 'EASY' ? 'bg-emerald-500' : d === 'MEDIUM' ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${(stats.byDifficulty[d].solved / Math.max(stats.byDifficulty[d].total, 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted w-10 text-right">
                {stats.byDifficulty[d].solved}/{stats.byDifficulty[d].total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent solved */}
      {stats.recentSolved.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted mb-2">Recently Solved</h4>
          <div className="space-y-1.5">
            {stats.recentSolved.slice(0, 3).map((q) => (
              <Link
                key={q.slug}
                href={`/questions/${q.slug}`}
                className="flex items-center gap-2 text-xs hover:bg-surface rounded-lg px-2 py-1.5 transition-colors -mx-2"
              >
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span className="text-primary font-medium truncate flex-1">{q.title}</span>
                <DifficultyBadge difficulty={q.difficulty} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
