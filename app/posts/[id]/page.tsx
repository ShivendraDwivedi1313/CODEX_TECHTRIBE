'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import CardActions from '@/components/CardActions'

interface PostDetail {
  id: string
  title: string
  description: string
  image: string
  authorId: string
  authorName: string
  authorAvatar: string
  likes: number
  createdAt: string
}

export default function PostPage() {
  const { id } = useParams() as { id: string }
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok) throw new Error('Post not found')
        const data = await res.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-96 h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-secondary mb-4">{error || 'Post not found'}</p>
            <Link href="/dashboard" className="text-violet-600 hover:text-violet-700 font-semibold">
              Back to Feed
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg dark:shadow-black/30">
            {/* Author Info */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <Link 
                href={`/user/${post.authorId}`}
                className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {post.authorAvatar && (
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-primary font-semibold text-lg hover:text-violet-600 transition-colors">
                    {post.authorName}
                  </h3>
                  <p className="text-sm text-secondary">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </Link>
            </div>

            {/* Image */}
            {post.image && (
              <div className="relative w-full aspect-video overflow-hidden bg-skeleton">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-primary mb-4">
                {post.title}
              </h1>

              <p className="text-primary text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                {post.description}
              </p>

              {/* Actions */}
              <CardActions likes={post.likes} postId={post.id} />
            </div>

            {/* Back Button */}
            <div className="px-6 py-4 border-t border-border bg-surface">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Feed
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
