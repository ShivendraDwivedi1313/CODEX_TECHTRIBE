'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { CodingDetailsResponse, PlatformStats } from '@/app/api/profile/coding-details/route'

const COLORS = {
  LEETCODE: '#8b5cf6', // Violet
  CODECHEF: '#10b981', // Emerald
  CODEFORCES: '#f59e0b', // Amber
}

export default function CodingStatsPage() {
  const [data, setData] = useState<CodingDetailsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/profile/coding-details')
        const details = await res.json()
        setData(details)
      } catch (error) {
        console.error('Failed to fetch coding details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const chartData = data.platforms.map((p) => ({
    name: p.platform,
    value: p.questions,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-primary p-4 md:p-8 overflow-x-hidden">
      {/* Back Link */}
      <Link 
        href="/profile"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-secondary hover:text-primary transition-colors group px-4 py-2 rounded-full bg-card/70 backdrop-blur-md border border-border shadow-sm"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
      </Link>

      <div className="max-w-6xl mx-auto pt-16 pb-12">
        {/* Title */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-violet-400/10 blur-[100px] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary mb-4 animate-in slide-in-from-top duration-700">
            CODER&apos;S PROFILE
          </h1>
          <p className="text-secondary text-sm font-bold uppercase tracking-[0.3em] ml-1">
            Global Analytics & Competitive Stats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Stat Card */}
          <div className="space-y-6">
            <StatDetailCard 
              platform={data.platforms.find(p => p.platform === 'CODECHEF')!} 
              color={COLORS.CODECHEF}
              align="left"
            />
          </div>

          {/* Center Chart Area */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS]} 
                        className="filter drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e5e7eb',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#111827'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(val) => <span className="text-xs font-bold text-primary uppercase tracking-widest">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Content */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-1">TOTAL</p>
                <h2 className="text-5xl font-black tracking-tighter text-primary">
                  {data.totalQuestions}
                </h2>
                <p className="text-primary text-xs font-bold uppercase tracking-widest">SOLVED</p>
              </div>
            </div>

            {/* Platform labels around chart - only on desktop */}
            <div className="hidden lg:block">
              {/* LeetCode Label */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-sm">
                <p className="text-[10px] font-black tracking-widest text-violet-600 uppercase">Top Contributor: LEETCODE</p>
              </div>
            </div>
          </div>

          {/* Right Stat Card */}
          <div className="space-y-6">
            <StatDetailCard 
              platform={data.platforms.find(p => p.platform === 'CODEFORCES')!} 
              color={COLORS.CODEFORCES}
              align="right"
            />
          </div>
        </div>

        {/* Bottom Stat Card */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md">
            <StatDetailCard 
              platform={data.platforms.find(p => p.platform === 'LEETCODE')!} 
              color={COLORS.LEETCODE}
              align="center"
            />
          </div>
        </div>

        {/* Aggregate Stats Footer */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          <AggregateStat label="Total Contests" value={data.totalContests} sub="Completed" />
          <AggregateStat label="Global Rank" value="#1,245" sub="Among Codebase Users" />
          <AggregateStat label="Overall Score" value={data.totalScore?.toLocaleString() || '0'} sub="XP Points" />
          <AggregateStat label="Activity" value="85%" sub="Last 30 Days" />
        </div>
      </div>
    </div>
  )
}

function StatDetailCard({ platform, color, align }: { platform: PlatformStats; color: string; align: 'left' | 'right' | 'center' }) {
  const isCodeforces = platform.platform === 'CODEFORCES'
  const isCodeChef = platform.platform === 'CODECHEF'

  return (
    <div className={`p-6 rounded-[24px] bg-card/80 backdrop-blur-sm border border-border relative group hover:border-border hover:shadow-md transition-all duration-500 ${align === 'right' ? 'text-right' : align === 'left' ? 'text-left' : 'text-center'}`}>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" 
        style={{ '--tw-gradient-from': `${color}05` } as React.CSSProperties}
      />
      
      <div className={`flex items-center gap-3 mb-4 ${align === 'right' ? 'flex-row-reverse' : align === 'left' ? 'flex-row' : 'justify-center'}`}>
        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-xl font-black italic tracking-tight text-primary">{platform.platform}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Solved</p>
          <p className="text-2xl font-black tracking-tighter text-primary">{platform.questions}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Contests</p>
          <p className="text-2xl font-black tracking-tighter text-primary">{platform.contests}</p>
        </div>
        {platform.currentRating && (
          <div className="col-span-2 mt-2 pt-4 border-t border-border">
            <div className={`flex justify-between items-end ${align === 'right' ? 'flex-row-reverse' : ''}`}>
               <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-3xl font-black tracking-tighter" style={{ color }}>{platform.currentRating}</p>
               </div>
               <div className={align === 'right' ? 'text-right' : 'text-left'}>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Rank</p>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">{platform.rank}</p>
               </div>
            </div>
          </div>
        )}
        {platform.points && (
           <div className="col-span-2 mt-2 pt-4 border-t border-border">
              <div className={`flex justify-between items-end ${align === 'right' ? 'flex-row-reverse' : ''}`}>
               <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Points</p>
                  <p className="text-3xl font-black tracking-tighter" style={{ color }}>{platform.points}</p>
               </div>
               <div className={align === 'right' ? 'text-right' : 'text-left'}>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Badge</p>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">{platform.rank}</p>
               </div>
            </div>
           </div>
        )}
      </div>
    </div>
  )
}

function AggregateStat({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border text-center hover:shadow-md hover:border-border transition-all">
      <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black tracking-tighter text-primary mb-1">{value}</p>
      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{sub}</p>
    </div>
  )
}
