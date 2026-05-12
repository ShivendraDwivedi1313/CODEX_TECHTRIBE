'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Profile } from '@/types/profile'

interface ProfileInfoProps {
  profile: Profile | null
  loading: boolean
  onFriendsClick?: () => void
  isOwnProfile?: boolean
  onProfileUpdate?: () => void
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

export default function ProfileInfo({ profile, loading, onFriendsClick, isOwnProfile = true, onProfileUpdate }: ProfileInfoProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null)
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (loading || !profile) return <SkeletonInfo />

  const openEditModal = () => {
    setEditName(profile.name || '')
    setEditBio(profile.bio || '')
    setEditAvatarPreview(null)
    setEditAvatarFile(null)
    setError('')
    setSuccess('')
    setShowEditModal(true)
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB')
        return
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, GIF, and WebP images are allowed')
        return
      }
      setEditAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSave = async () => {
    const trimmedName = editName.trim()
    if (!trimmedName) {
      setError('Name is required')
      return
    }
    if (trimmedName.length > 50) {
      setError('Name must be 50 characters or less')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let avatarUrl: string | undefined

      // Upload avatar if changed
      if (editAvatarFile) {
        const formData = new FormData()
        formData.append('avatar', editAvatarFile)
        const avatarRes = await fetch('/api/profile/avatar', {
          method: 'POST',
          body: formData,
        })
        if (!avatarRes.ok) {
          const data = await avatarRes.json().catch(() => ({}))
          if (avatarRes.status === 429) {
            throw new Error('Too many uploads. Please wait a moment and try again.')
          }
          throw new Error(data.message || 'Failed to upload avatar')
        }
        const avatarData = await avatarRes.json()
        avatarUrl = avatarData.avatarUrl
      }

      // Update profile
      const updateBody: Record<string, string> = {
        name: trimmedName,
        bio: editBio.trim(),
      }
      if (avatarUrl) {
        updateBody.avatarUrl = avatarUrl
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 429) {
          throw new Error('Too many updates. Please wait a moment and try again.')
        }
        throw new Error(data.message || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        setShowEditModal(false)
        if (onProfileUpdate) {
          onProfileUpdate()
        } else {
          window.location.reload()
        }
      }, 600)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-violet-500/10 dark:ring-violet-400/15 ring-offset-4 ring-offset-card shadow-xl">
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
          <h2 className="text-primary font-bold text-lg sm:text-xl">{profile.name}</h2>
          {profile.username && (
            <p className="text-secondary text-sm mt-0.5">{profile.username}</p>
          )}
        </div>

        {/* TechTribe Score */}
        {typeof profile.points === 'number' && (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-400/25 dark:border-amber-400/20">
            <svg className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              {profile.points.toLocaleString()}
            </span>
            <span className="text-xs text-secondary font-medium whitespace-nowrap">TechTribe Score</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-muted text-xs text-center max-w-[200px] leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Buttons */}
        {isOwnProfile && (
          <div className="grid grid-cols-2 gap-2 w-full mt-2">
            <Link
              href="/profile/edit"
              className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-surface border border-border text-primary hover:bg-border transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
              </svg>
              Handles
            </Link>
            <button
              onClick={openEditModal}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-600/20 dark:shadow-violet-500/15 hover:bg-violet-700 dark:hover:bg-violet-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        )}
      </div>

      {/* Edit Settings Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => !saving && setShowEditModal(false)} />
          <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-black/40 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
              <h3 className="text-primary font-bold text-lg sm:text-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Edit Settings
              </h3>
              <button
                onClick={() => !saving && setShowEditModal(false)}
                className="text-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface transition-all"
                disabled={saving}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3">
                <label className="text-sm font-semibold text-primary">Profile Picture</label>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-violet-500/10 dark:ring-violet-400/15 ring-offset-4 ring-offset-card shadow-xl transition-all group-hover:ring-violet-500/30 dark:group-hover:ring-violet-400/30">
                    <Image
                      src={editAvatarPreview || profile.avatar || 'https://picsum.photos/seed/default/200/200'}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
                <p className="text-xs text-muted">Click to change • JPG, PNG, GIF, WebP • Max 5MB</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your display name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary placeholder:text-muted focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all"
                />
                <p className="text-xs text-muted mt-1.5">{editName.length}/50 characters</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell the community about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary placeholder:text-muted focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all resize-none"
                />
                <p className="text-xs text-muted mt-1.5">{editBio.length}/500 characters</p>
              </div>


              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-400/25 dark:border-red-400/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="px-4 py-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-400/25 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3 rounded-b-2xl sm:rounded-b-3xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 sm:px-6 py-2.5 rounded-xl text-primary bg-surface border border-border font-medium hover:bg-border transition-all text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 text-white font-medium hover:from-violet-500 hover:to-indigo-500 dark:hover:from-violet-400 dark:hover:to-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
