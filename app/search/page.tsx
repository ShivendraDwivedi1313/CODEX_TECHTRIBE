'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/search/SearchBar'
import SearchResults from '@/components/search/SearchResults'
import { User } from '@/types/user'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/users?query=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 py-4 flex items-center justify-between md:pl-5 pl-16">
          <h1 className="text-primary font-bold text-xl tracking-tight">Search</h1>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            T
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary tracking-tight">Find Developers</h2>
              <p className="text-secondary">Search for people by their name or username.</p>
              <div className="pt-2">
                <SearchBar value={query} onChange={setQuery} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest px-1">
                {query ? `Search results for "${query}"` : 'Recommended Developers'}
              </h3>
              <SearchResults users={results} loading={loading} query={query} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
