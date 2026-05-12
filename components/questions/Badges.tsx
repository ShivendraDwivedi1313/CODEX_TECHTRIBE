'use client'

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    EASY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    HARD: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[difficulty] || 'bg-skeleton text-secondary'}`}>
      {difficulty}
    </span>
  )
}

export function VerdictBadge({ verdict }: { verdict: string }) {
  const colors: Record<string, string> = {
    ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    WRONG_ANSWER: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    COMPILATION_ERROR: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    RUNTIME_ERROR: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    TIME_LIMIT_EXCEEDED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  }
  const labels: Record<string, string> = {
    ACCEPTED: 'Accepted',
    WRONG_ANSWER: 'Wrong Answer',
    COMPILATION_ERROR: 'Compile Error',
    RUNTIME_ERROR: 'Runtime Error',
    TIME_LIMIT_EXCEEDED: 'TLE',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[verdict] || 'bg-skeleton text-secondary'}`}>
      {labels[verdict] || verdict}
    </span>
  )
}
