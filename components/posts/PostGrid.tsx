'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/types/post'
import PostCard from './PostCard'

interface PostGridProps {
  userId?: string
  initialPosts?: Post[]
}

function SkeletonPostCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse shadow-sm">
      <div className="w-full aspect-[3/2] bg-skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-skeleton rounded-lg w-3/4" />
        <div className="h-3 bg-surface rounded-lg w-full" />
      </div>
    </div>
  )
}

export default function PostGrid({ userId, initialPosts }: PostGridProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts)
  const isOwnProfile = !userId // If no userId provided, viewing own profile

  useEffect(() => {
    if (initialPosts) return
    
    const fetchPosts = async () => {
      try {
        const url = userId ? `/api/profile/posts?userId=${userId}` : '/api/profile/posts'
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch posts')
        const data: Post[] = await res.json()
        setPosts(data)
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [userId, initialPosts])

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-primary font-semibold text-lg">{userId ? 'Their Posts' : 'Your Posts'}</h2>
        <span className="text-xs text-secondary">{loading ? '...' : `${posts.length} posts`}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonPostCard key={i} />)
          : posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                isOwnPost={isOwnProfile}
                onPostDeleted={() => handlePostDeleted(post.id)}
              />
            ))}
      </div>
    </div>
  )
}
