'use client'

import { useState, useEffect } from 'react'
import { Channel } from '@/types/channel'

interface SearchChannelModalProps {
  onClose: () => void
  onSelect: (channelId: string) => void
}

export default function SearchChannelModal({ onClose, onSelect }: SearchChannelModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      
      setLoading(true)
      try {
        // Search for channels across all communities
        const res = await fetch(`/api/channels/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data || [])
      } catch (error) {
        console.error('Failed to fetch channels:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (channelId: string) => {
    onSelect(channelId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-primary">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-surface/30">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-primary font-bold text-xl">Search Channel</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-border hover:text-primary transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-secondary text-sm mt-1">Find and join channels across communities</p>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels..."
            className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-sm focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
          />
        </div>

        {/* Results */}
        <div className="px-2 pb-4 h-[320px] overflow-y-auto">
          {loading && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Searching channels...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface group transition-colors">
                  <div className="flex items-center gap-3 font-semibold min-w-0">
                    <span className="text-2xl flex-shrink-0">{channel.logo || '💬'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{channel.name}</p>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{channel.members || 0} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelect(channel.id)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-bold border border-violet-100 hover:bg-violet-600 hover:text-white transition-all whitespace-nowrap"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg className="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-secondary font-semibold">No channels found</p>
              <p className="text-xs text-muted">Try searching for different keywords</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg className="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm text-secondary font-semibold">Start typing to search</p>
              <p className="text-xs text-muted">Find channels to join</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
