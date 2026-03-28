'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import HandleInputRow from '@/components/profile/HandleInputRow'

const VERIFY_LINKS: Record<string, string> = {
  CODEFORCES: 'https://codeforces.com/problemset/problem/1765/M',
  LEETCODE: 'https://leetcode.com/problems/two-sum/description/',
  CODECHEF: 'https://www.codechef.com/problems/NO25PLS',
}

const VERIFY_ENDPOINTS: Record<string, string> = {
  CODEFORCES: '/api/profile/verify/codeforces',
  LEETCODE: '/api/profile/verify/leetcode',
  CODECHEF: '/api/profile/verify/codechef',
}

type Platform = 'CODECHEF' | 'CODEFORCES' | 'LEETCODE'

export default function EditProfilePage() {
  const [handles, setHandles] = useState({
    CODECHEF: '',
    CODEFORCES: '',
    LEETCODE: '',
  })

  const [loading, setLoading] = useState({
    CODECHEF: false,
    CODEFORCES: false,
    LEETCODE: false,
  })

  const [messages, setMessages] = useState({
    CODECHEF: '',
    CODEFORCES: '',
    LEETCODE: '',
  })

  // Verification state
  const [verifying, setVerifying] = useState({
    CODECHEF: false,
    CODEFORCES: false,
    LEETCODE: false,
  })

  const [verified, setVerified] = useState({
    CODECHEF: false,
    CODEFORCES: false,
    LEETCODE: false,
  })

  const [timeLeft, setTimeLeft] = useState({
    CODECHEF: 120,
    CODEFORCES: 120,
    LEETCODE: 120,
  })

  const timerRefs = useRef<Record<string, NodeJS.Timeout | null>>({
    CODECHEF: null,
    CODEFORCES: null,
    LEETCODE: null,
  })

  // Fetch initial verified status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/profile/verify/status')
        if (res.ok) {
          const data = await res.json()
          setVerified({
            CODEFORCES: data.codeforces || false,
            CODECHEF: data.codechef || false,
            LEETCODE: data.leetcode || false,
          })
        }
      } catch {}
    }
    fetchStatus()
  }, [])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(timer => {
        if (timer) clearInterval(timer)
      })
    }
  }, [])

  const handleInputChange = (platform: Platform, value: string) => {
    setHandles((prev) => ({ ...prev, [platform]: value }))
    if (messages[platform]) {
      setMessages((prev) => ({ ...prev, [platform]: '' }))
    }
  }

  const handleSubmit = async (platform: Platform) => {
    if (!handles[platform]) {
      setMessages((prev) => ({ ...prev, [platform]: 'Please enter a URL or handle.' }))
      return
    }

    setLoading((prev) => ({ ...prev, [platform]: true }))
    setMessages((prev) => ({ ...prev, [platform]: '' }))

    try {
      const response = await fetch('/api/profile/coding-handles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, handle: handles[platform] }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessages((prev) => ({ ...prev, [platform]: data.message || 'Failed to update handle.' }))
      } else {
        setMessages((prev) => ({ ...prev, [platform]: data.message }))
      }
    } catch (error) {
      setMessages((prev) => ({ ...prev, [platform]: 'Error updating handle. Please try again.' }))
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }))
    }
  }

  const handleVerify = async (platform: Platform) => {
    setVerifying((prev) => ({ ...prev, [platform]: true }))
    setTimeLeft((prev) => ({ ...prev, [platform]: 120 }))
    setMessages((prev) => ({ ...prev, [platform]: '' }))

    // Start countdown timer
    timerRefs.current[platform] = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev[platform] - 1
        if (newTime <= 0) {
          if (timerRefs.current[platform]) {
            clearInterval(timerRefs.current[platform]!)
            timerRefs.current[platform] = null
          }
          return { ...prev, [platform]: 0 }
        }
        return { ...prev, [platform]: newTime }
      })
    }, 1000)

    try {
      const res = await fetch(VERIFY_ENDPOINTS[platform], { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        setVerified((prev) => ({ ...prev, [platform]: true }))
        setMessages((prev) => ({ ...prev, [platform]: `✅ ${platform} verified successfully!` }))
      } else {
        setMessages((prev) => ({ ...prev, [platform]: data.message || 'No valid submission found. Try again.' }))
      }
    } catch (error) {
      setMessages((prev) => ({ ...prev, [platform]: 'Error during verification. Please try again.' }))
    } finally {
      setVerifying((prev) => ({ ...prev, [platform]: false }))
      if (timerRefs.current[platform]) {
        clearInterval(timerRefs.current[platform]!)
        timerRefs.current[platform] = null
      }
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/profile"
        className="mb-8 flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Profile</span>
      </Link>

      {/* Card Container */}
      <div className="w-full max-w-2xl bg-card rounded-[32px] shadow-xl shadow-black/5 dark:shadow-black/30 border border-border p-8 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Coding Handles</h1>
          <p className="text-secondary">Connect your profiles to track your progress and stats.</p>
        </div>

        <div className="space-y-8">
          <HandleInputRow
            platform="CODECHEF"
            placeholder="https://www.codechef.com/users/username"
            value={handles.CODECHEF}
            loading={loading.CODECHEF}
            message={messages.CODECHEF}
            onChange={(val) => handleInputChange('CODECHEF', val)}
            onSubmit={() => handleSubmit('CODECHEF')}
            onVerify={() => handleVerify('CODECHEF')}
            isVerifying={verifying.CODECHEF}
            isVerified={verified.CODECHEF}
            verifyLink={VERIFY_LINKS.CODECHEF}
            verifyTimeLeft={verifying.CODECHEF ? timeLeft.CODECHEF : undefined}
          />

          <HandleInputRow
            platform="CODEFORCES"
            placeholder="https://codeforces.com/profile/username"
            value={handles.CODEFORCES}
            loading={loading.CODEFORCES}
            message={messages.CODEFORCES}
            onChange={(val) => handleInputChange('CODEFORCES', val)}
            onSubmit={() => handleSubmit('CODEFORCES')}
            onVerify={() => handleVerify('CODEFORCES')}
            isVerifying={verifying.CODEFORCES}
            isVerified={verified.CODEFORCES}
            verifyLink={VERIFY_LINKS.CODEFORCES}
            verifyTimeLeft={verifying.CODEFORCES ? timeLeft.CODEFORCES : undefined}
          />

          <HandleInputRow
            platform="LEETCODE"
            placeholder="https://leetcode.com/username"
            value={handles.LEETCODE}
            loading={loading.LEETCODE}
            message={messages.LEETCODE}
            onChange={(val) => handleInputChange('LEETCODE', val)}
            onSubmit={() => handleSubmit('LEETCODE')}
            onVerify={() => handleVerify('LEETCODE')}
            isVerifying={verifying.LEETCODE}
            isVerified={verified.LEETCODE}
            verifyLink={VERIFY_LINKS.LEETCODE}
            verifyTimeLeft={verifying.LEETCODE ? timeLeft.LEETCODE : undefined}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted">
            Make sure your profile is public so we can fetch your latest statistics.
          </p>
        </div>
      </div>
    </div>
  )
}
