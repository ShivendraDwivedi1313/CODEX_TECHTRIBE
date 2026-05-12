'use client'

export interface QuestionStatsData {
  total: number
  leetcode: number
  codechef: number
  codeforces: number
}

interface QuestionWheelProps {
  stats: QuestionStatsData | null
  loading: boolean
}

function SkeletonWheel() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <div className="w-44 h-44 rounded-full bg-skeleton border-8 border-surface" />
      <div className="h-5 w-28 bg-surface rounded-lg" />
    </div>
  )
}

export default function QuestionWheel({ stats, loading }: QuestionWheelProps) {
  if (loading || !stats) return <SkeletonWheel />

  const { total, leetcode, codechef, codeforces } = stats
  const radius = 70
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius

  const lcPct = total > 0 ? leetcode / total : 0
  const ccPct = total > 0 ? codechef / total : 0
  const cfPct = total > 0 ? codeforces / total : 0

  const lcLen = lcPct * circumference
  const ccLen = ccPct * circumference
  const cfLen = cfPct * circumference

  const lcOffset = 0
  const ccOffset = lcLen
  const cfOffset = lcLen + ccLen

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Donut Chart */}
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background ring */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth={strokeWidth}
          />

          {/* Codeforces segment - Amber */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${cfLen} ${circumference - cfLen}`}
            strokeDashoffset={-cfOffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="transition-all duration-700"
          />

          {/* CodeChef segment - Emerald */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${ccLen} ${circumference - ccLen}`}
            strokeDashoffset={-ccOffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="transition-all duration-700"
          />

          {/* LeetCode segment - Violet */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lcLen} ${circumference - lcLen}`}
            strokeDashoffset={-lcOffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="transition-all duration-700"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-primary">{total}</span>
          <span className="text-xs text-secondary mt-0.5">Solved</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-xs text-secondary">LC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-secondary">CC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs text-secondary">CF</span>
        </div>
      </div>
    </div>
  )
}
