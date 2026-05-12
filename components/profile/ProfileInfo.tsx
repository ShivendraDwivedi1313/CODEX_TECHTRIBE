'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Profile } from '@/types/profile'

interface ProfileInfoProps {
  profile: Profile | null
  loading: boolean
  onFriendsClick?: () => void
  isOwnProfile?: boolean
}

function SkeletonInfo() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <div className="w-28 h-28 rounded-full bg-skeleton" />
      <div className="h-5 w-32 bg-skeleton rounded-lg" />
      <div className="h-4 w-20 bg-surface rounded-lg" />
      <div className="h-9 w-36 bg-surface rounded-xl" />
    </div>
  )
}

export default function ProfileInfo({ profile, loading, onFriendsClick, isOwnProfile = true }: ProfileInfoProps) {
  if (loading || !profile) return <SkeletonInfo />

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-violet-500/10 ring-offset-4 ring-offset-card shadow-xl">
          <Image
            src={profile.avatar || 'https://picsum.photos/seed/default/200/200'}
            alt={profile.name || 'User avatar'}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-card" />
      </div>

      {/* Name */}
      <div className="text-center">
        <h2 className="text-primary font-bold text-xl">{profile.name}</h2>
        {profile.username && (
          <p className="text-secondary text-sm mt-0.5">{profile.username}</p>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-muted text-xs text-center max-w-[200px] leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Buttons */}
      {isOwnProfile && (
        <div className="flex flex-col gap-2 w-full">
          <Link href="/profile/edit" className="w-full">
            <button className="w-full px-5 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all duration-200">
              Add / Edit Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
