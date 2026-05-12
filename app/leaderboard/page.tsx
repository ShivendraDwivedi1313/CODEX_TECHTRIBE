'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import LeaderboardStatsSection from '@/components/leaderboard/LeaderboardStats'
import TopThreeUsers from '@/components/leaderboard/TopThreeUsers'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import { LeaderboardStats, LeaderboardUser, TopUser } from '@/types/leaderboard'

export default function LeaderboardPage() {
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [top3, setTop3] = useState<TopUser[]>([])
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [res, t3Res] = await Promise.all([
          fetch('/api/leaderboard'),
          fetch('/api/leaderboard/top3'),
        ])
        const [data, t3Data] = await Promise.all([
          res.json(),
          t3Res.json(),
        ])
        setStats(data.stats)
        setUsers(data.users)
        setTop3(t3Data)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 py-4 flex items-center justify-between md:pl-5 pl-16 shadow-sm dark:shadow-black/10">
          <h1 className="text-primary font-bold text-xl tracking-tight">Leaderboard</h1>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-muted uppercase font-bold">Global Rank</span>
                <span className="text-xs text-amber-400 font-bold">#1,248</span>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              T
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Stats */}
            <LeaderboardStatsSection stats={stats} loading={loading} />

            {/* Main Leaderboard Card */}
            <div className="bg-card border border-border rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-black/5 dark:shadow-black/30 space-y-10">
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-bold text-primary">Top TechTribers</h2>
                <p className="text-sm text-secondary">The most active developers in the community.</p>
              </div>

              <TopThreeUsers users={top3} loading={loading} />

              <div className="pt-2">
                <LeaderboardTable users={users} loading={loading} />
              </div>
            </div>

            <div className="h-8" /> {/* Spacer */}
          </div>
        </div>
      </main>
    </div>
  )
}
