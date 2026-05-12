'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { DifficultyBadge } from '@/components/questions/Badges'

interface Question {
  id: string
  title: string
  slug: string
  difficulty: string
  tags: string[]
  solved: boolean
  attempts: number
}

const DIFFICULTY_TABS = ['ALL', 'EASY', 'MEDIUM', 'HARD']

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('ALL')
  const [selectedTag, setSelectedTag] = useState('')
  const [allTags, setAllTags] = useState<string[]>([])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (difficulty !== 'ALL') params.set('difficulty', difficulty)
      if (selectedTag) params.set('tag', selectedTag)

      const res = await fetch(`/api/questions?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions)
        // Extract unique tags
        const tags = new Set<string>()
        data.questions.forEach((q: Question) => q.tags.forEach(t => tags.add(t)))
        setAllTags(Array.from(tags).sort())
      }
    } catch (e) {
      console.error('Failed to fetch questions:', e)
    } finally {
      setLoading(false)
    }
  }, [search, difficulty, selectedTag])

  useEffect(() => {
    const timer = setTimeout(fetchQuestions, 300)
    return () => clearTimeout(timer)
  }, [fetchQuestions])

  const solvedCount = questions.filter(q => q.solved).length

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Coding Questions</h1>
              <p className="text-secondary text-sm mt-1">
                Practice DSA problems and track your progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-card border border-border rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-violet-600">{solvedCount}</div>
                <div className="text-xs text-muted">Solved</div>
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-primary">{questions.length}</div>
                <div className="text-xs text-muted">Total</div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search questions by title or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-primary placeholder:text-muted focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
              />
            </div>

            {/* Difficulty tabs */}
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTY_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDifficulty(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    difficulty === tab
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-surface text-secondary hover:text-primary hover:bg-border'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Tag chips */}
            {allTags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag('')}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 hover:opacity-80 transition-opacity"
                  >
                    ✕ {selectedTag}
                  </button>
                )}
                {allTags.filter(t => t !== selectedTag).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-surface text-secondary hover:text-primary hover:bg-border transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_100px_auto] sm:grid-cols-[40px_1fr_100px_200px] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted uppercase tracking-wider">
              <div></div>
              <div>Title</div>
              <div>Difficulty</div>
              <div className="hidden sm:block">Tags</div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted">
                <div className="animate-spin w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="p-8 text-center text-muted">No questions found</div>
            ) : (
              questions.map((q) => (
                <Link
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="grid grid-cols-[40px_1fr_100px_auto] sm:grid-cols-[40px_1fr_100px_200px] gap-4 px-4 py-3.5 border-b border-border hover:bg-surface transition-colors items-center group"
                >
                  {/* Solved indicator */}
                  <div className="flex justify-center">
                    {q.solved ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    ) : q.attempts > 0 ? (
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                  </div>

                  {/* Title */}
                  <div className="text-sm font-medium text-primary group-hover:text-violet-600 transition-colors truncate">
                    {q.title}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex gap-1 flex-wrap">
                    {q.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface text-muted">
                        {tag}
                      </span>
                    ))}
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
