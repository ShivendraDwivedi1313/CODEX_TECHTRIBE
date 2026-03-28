'use client'

import { useEffect, useState } from 'react'
import { Profile } from '@/types/profile'
import ProfileInfo from './ProfileInfo'
import QuestionWheel, { QuestionStatsData } from './QuestionWheel'
import QuestionStats from './QuestionStats'

interface ProfileCardProps {
  onFriendsClick?: () => void
  userId?: string
}

export default function ProfileCard({ onFriendsClick, userId }: ProfileCardProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<QuestionStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const profileUrl = userId ? `/api/profile/${userId}` : '/api/profile'
        const statsUrl = userId ? `/api/profile/${userId}/stats` : '/api/profile/stats'
        
        const [profileRes, statsRes] = await Promise.all([
          fetch(profileUrl),
          fetch(statsUrl),
        ])
        const [profileData, statsData] = await Promise.all([
          profileRes.json(),
          statsRes.json(),
        ])
        setProfile(profileData)
        setStats(statsData)
      } catch {
        // silently fail; components handle null state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center">
        {/* Left – Profile Info */}
        <div className="flex justify-center">
          <ProfileInfo profile={profile} loading={loading} onFriendsClick={onFriendsClick} isOwnProfile={!userId} />
        </div>

        {/* Center – Question Wheel */}
        <div className="flex justify-center">
          <QuestionWheel stats={stats} loading={loading} />
        </div>

        {/* Right – Stats Controls */}
        <div className="w-full max-w-[260px] mx-auto">
          <QuestionStats stats={stats} loading={loading} userId={userId} />
        </div>
      </div>
    </div>
  )
}
