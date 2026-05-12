'use client'

import { use } from 'react'
import Sidebar from '@/components/Sidebar'
import ProfileCard from '@/components/profile/ProfileCard'
import PostGrid from '@/components/posts/PostGrid'
import QuestionStatsCard from '@/components/questions/QuestionStatsCard'
import VerificationBadges from '@/components/profile/VerificationBadges'

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params)

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Top – Profile Summary Card */}
          <ProfileCard userId={id} />

          {/* Coding Progress */}
          <QuestionStatsCard userId={id} />

          {/* Platform Verification */}
          <VerificationBadges userId={id} />

          {/* Bottom – Posts Grid */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <PostGrid userId={id} />
          </div>
        </div>
      </main>
    </div>
  )
}
