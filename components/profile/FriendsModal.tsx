'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/types/user'

interface FriendsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FriendsModal({ isOpen, onClose }: FriendsModalProps) {
  const [friends, setFriends] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      const fetchFriends = async () => {
        try {
          setLoading(true)
          const res = await fetch('/api/profile/friends')
          const data = await res.json()
          setFriends(data)
        } catch (error) {
          console.error('Failed to fetch friends:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchFriends()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-primary font-bold text-xl">Friends</h3>
            <p className="text-secondary text-sm">People you follow</p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-secondary transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-skeleton rounded" />
                  <div className="h-3 w-16 bg-surface rounded" />
                </div>
              </div>
            ))
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl h-16 hover:bg-surface transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-violet-500/10">
                    <Image 
                      src={friend.avatar || 'https://picsum.photos/seed/default/200/200'} 
                      alt={friend.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-primary font-semibold text-sm">{friend.name}</h4>
                    <p className="text-secondary text-xs">{friend.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/chat/${friend.id}`}
                    onClick={onClose}
                    className="p-2 rounded-lg text-violet-600 hover:bg-violet-100 transition-colors bg-violet-50"
                    title="Chat in Debug Room"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                  <Link 
                    href={`/user/${friend.id}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-border border border-border transition-colors bg-card"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">No friends found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
