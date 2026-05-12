'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import PostGrid from '@/components/posts/PostGrid'
import PublicProfileCard from '@/components/profile/PublicProfileCard'

interface UserProfile {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  joinedDate: string
  headline?: string
  college?: string
  company?: string
  location?: string
  website?: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  skills: string[]
  interests: string[]
  points?: number
  stats?: any
  handles?: any
  posts?: any[]
  projects?: any[]
}

export default function PublicProfilePage() {
  const { id } = useParams() as { id: string }
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`)
        if (!res.ok) throw new Error('Profile not found')
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProfile()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="w-32 h-32 rounded-full bg-slate-700" />
            <div className="w-40 h-4 bg-slate-700 rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg text-slate-400 mb-4">{error || 'User not found'}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Profile Card with all details */}
          <PublicProfileCard 
            userId={id} 
            profile={profile} 
            initialStats={profile.stats}
            initialHandles={profile.handles}
          />

          {/* Posts Grid */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <PostGrid userId={id} initialPosts={profile.posts} />
          </div>
        </div>
      </main>
    </div>
  )
}
