'use client'

import { useEffect, useState, useCallback } from 'react'
import { CardData } from '@/types/card'
import Card from './Card'

interface FeedResponse {
  posts: CardData[]
  nextCursor: string | null
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-skeleton rounded-lg w-3/4" />
        <div className="h-4 bg-skeleton/60 rounded-lg w-full" />
        <div className="h-4 bg-skeleton/60 rounded-lg w-5/6" />
        <div className="pt-4 border-t border-border flex gap-3">
          <div className="h-8 w-16 bg-skeleton/60 rounded-xl" />
          <div className="h-8 w-16 bg-skeleton/60 rounded-xl" />
          <div className="h-8 w-16 bg-skeleton/60 rounded-xl ml-auto" />
        </div>
      </div>
    </div>
  )
}

export default function Feed() {
  const [posts, setPosts] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const fetchFeed = useCallback(async (cursor?: string) => {
    try {
      const params = new URLSearchParams()
      if (cursor) params.set('cursor', cursor)
      params.set('limit', '10')

      const res = await fetch(`/api/feed?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch feed')
      const data: FeedResponse = await res.json()

      setPosts((prev) => cursor ? [...prev, ...data.posts] : data.posts)
      setNextCursor(data.nextCursor)
    } catch {
      setError('Could not load feed. Please try again.')
    }
  }, [])

  useEffect(() => {
    fetchFeed().finally(() => setLoading(false))
  }, [fetchFeed])

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    await fetchFeed(nextCursor)
    setLoadingMore(false)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-secondary">
        <svg className="w-12 h-12 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : posts.map((post) => <Card key={post.id} data={post} />)}

      {!loading && nextCursor && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="mx-auto px-6 py-3 rounded-xl bg-violet-50 text-violet-600 font-semibold text-sm
                     border border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMore ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}

