'use client'

import { useState, useEffect } from 'react'

interface VerificationBadgesProps {
  userId?: string
}

export default function VerificationBadges({ userId }: VerificationBadgesProps) {
  const [status, setStatus] = useState({ codeforces: false, codechef: false, leetcode: false })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const url = userId ? `/api/profile/verify/status?userId=${userId}` : '/api/profile/verify/status'
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch {}
      setLoaded(true)
    }
    fetchStatus()
  }, [userId])

  if (!loaded) return null

  const platforms = [
    { key: 'codeforces', label: 'CF', name: 'Codeforces', color: 'blue' },
    { key: 'leetcode', label: 'LC', name: 'LeetCode', color: 'amber' },
    { key: 'codechef', label: 'CC', name: 'CodeChef', color: 'orange' },
  ] as const

  const colorMap = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500' },
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        Platform Verification
      </h3>
      <div className="flex items-center gap-3">
        {platforms.map(({ key, label, name, color }) => {
          const verified = status[key]
          const colors = colorMap[color]
          return (
            <div
              key={key}
              className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                verified
                  ? `${colors.bg} ${colors.border}`
                  : 'bg-rose-500/5 border-rose-500/15'
              }`}
              title={`${name} ${verified ? 'Verified' : 'Not Verified'}`}
            >
              <span className={`text-xs font-bold ${verified ? colors.text : 'text-rose-400'}`}>
                {label}
              </span>
              <span className={`text-xs font-semibold ${verified ? colors.text : 'text-rose-400'}`}>
                {name}
              </span>
              {/* Status icon */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                verified ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {verified ? (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
