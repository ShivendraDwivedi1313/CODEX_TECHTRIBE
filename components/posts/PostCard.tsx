'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Post } from '@/types/post'

interface PostCardProps {
  post: Post
  isOwnPost?: boolean
  onPostDeleted?: () => void
}

export default function PostCard({ post, isOwnPost = false, onPostDeleted }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.status === 200 || res.status === 204) {
        onPostDeleted?.()
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Delete failed:', res.status, errorData)
        // alert(errorData.message || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      // alert('Error deleting post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative">
      {/* Delete Button */}
      {isOwnPost && (
        <button
          onClick={handleDeletePost}
          disabled={isDeleting}
          className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete post"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      {/* Image */}
      {post.image && (
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title ?? 'Post image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {post.title && (
           <h3 className="text-primary font-semibold text-sm leading-snug mb-1.5 group-hover:text-violet-600 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
        )}
        {post.description && (
           <p className="text-secondary text-xs leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </article>
  )
}
