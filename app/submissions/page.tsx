'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { DifficultyBadge, VerdictBadge } from '@/components/questions/Badges'

interface Submission {
  id: string; language: string; verdict: string
  passedTestCases: number; totalTestCases: number
  runtime: number | null; submittedAt: string
  question: { title: string; slug: string; difficulty: string }
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/submissions?limit=50')
        if (res.ok) {
          const data = await res.json()
          setSubmissions(data.submissions)
        }
      } catch (e) {
        console.error('Failed to fetch submissions:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Submissions</h1>
            <p className="text-secondary text-sm mt-1">Track your coding submissions history</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_90px_100px_70px_60px_100px] gap-3 px-4 py-3 border-b border-border text-xs font-semibold text-muted uppercase tracking-wider">
              <div>Question</div>
              <div>Difficulty</div>
              <div>Verdict</div>
              <div>Lang</div>
              <div>Time</div>
              <div>Submitted</div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted">
                <div className="animate-spin w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full mx-auto mb-2" />
                Loading submissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <p>No submissions yet</p>
                <Link href="/questions" className="text-violet-600 hover:underline text-sm mt-2 inline-block">
                  Start solving questions →
                </Link>
              </div>
            ) : (
              submissions.map((s) => (
                <Link
                  key={s.id}
                  href={`/questions/${s.question.slug}`}
                  className="grid grid-cols-[1fr_90px_100px_70px_60px_100px] gap-3 px-4 py-3 border-b border-border hover:bg-surface transition-colors items-center text-sm"
                >
                  <div className="text-primary font-medium truncate">{s.question.title}</div>
                  <div><DifficultyBadge difficulty={s.question.difficulty} /></div>
                  <div><VerdictBadge verdict={s.verdict} /></div>
                  <div className="text-xs text-muted capitalize">{s.language}</div>
                  <div className="text-xs text-muted">{s.runtime ? `${s.runtime}ms` : '—'}</div>
                  <div className="text-xs text-muted">
                    {new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
