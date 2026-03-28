'use client'

import { useState, useEffect } from 'react'
import { CommunityCategory } from '@/types/community'

interface JoinCommunityModalProps {
  onClose: () => void
  onJoin: (id: string) => void
}

export default function JoinCommunityModal({ onClose, onJoin }: JoinCommunityModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [joiningId, setJoiningId] = useState<string | null>(null)

  useEffect(() => {
    const search = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/communities?joinable=true`)
        const data = await res.json()
        setResults(data.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase())))
      } catch (error) {
        console.error('Failed to fetch joinable communities:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleJoin = async (communityId: string) => {
    setJoiningId(communityId)
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId }),
      })
      if (res.ok) {
        onJoin(communityId)
        onClose()
      }
    } catch (error) {
      console.error('Failed to join community:', error)
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-primary">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-surface/30">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-primary font-bold text-xl">Join Community</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-border hover:text-primary transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-secondary text-sm mt-1">Discover new communities to join</p>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-sm focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
          />
        </div>

        {/* Results */}
        <div className="px-2 pb-4 h-[320px] overflow-y-auto">
          {loading && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading communities...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface group transition-colors">
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-2xl">{c.logo || '📢'}</span>
                    <div>
                      <p className="text-sm font-bold text-primary">{c.name}</p>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{c.members || 0} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoin(c.id)}
                    disabled={joiningId === c.id}
                    className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-[11px] font-bold hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {joiningId === c.id ? 'Joining...' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center text-muted">
              <span className="text-3xl mb-3 opacity-20">🔍</span>
              <p className="text-sm font-medium">No communities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
