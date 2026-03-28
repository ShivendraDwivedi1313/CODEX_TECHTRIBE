'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User } from '@/types/user'
import { useState, useEffect } from 'react'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  const [friendStatus, setFriendStatus] = useState<string>('LOADING')
  const [requestId, setRequestId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/friends/status/${user.id}`)
        const data = await res.json()
        if (data.status) {
          if (data.status === 'SELF') {
            setFriendStatus('SELF')
            setRequestId(null)
            return
          }
          setFriendStatus(data.status)
          setRequestId(data.requestId || null)
        }
      } catch (e) {
        setFriendStatus('NOT_CONNECTED')
        setRequestId(null)
      }
    }
    fetchStatus()
  }, [user.id])

  const handleAction = async (endpoint: string, method: string) => {
    setIsLoading(true)
    try {
      let body: any = {}
      
      // Determine the correct body based on the endpoint
      if (endpoint === '/api/friends/request') {
        // For sending initial friend request
        body = { receiverId: user.id }
      } else if (endpoint === '/api/friends/remove') {
        // Remove endpoint expects friendId, not requestId
        body = { friendId: user.id }
      } else {
        // For cancel, accept, reject operations
        body = { requestId }
      }
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        // Refresh status
        const statusRes = await fetch(`/api/friends/status/${user.id}`)
        const data = await statusRes.json()
        if (data.status) {
          setFriendStatus(data.status)
          setRequestId(data.requestId || null)
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData?.error || 'Failed to perform action'
        alert(errorMessage)
        console.error('API Error:', errorMessage)
      }
    } catch (error) {
      alert('An unexpected error occurred')
      console.error('Error performing action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const btnStyle = "px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 whitespace-nowrap"

  return (
    <div className="group bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:bg-card hover:border-violet-600/30 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border group-hover:ring-violet-600/40 transition-all">
        <Image
          src={user.avatar || 'https://via.placeholder.com/56?text=User'}
          alt={user.name}
          width={56}
          height={56}
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-primary font-bold truncate group-hover:text-violet-600 transition-colors">
          {user.name}
        </h3>
        <p className="text-xs text-secondary truncate font-medium">@{user.username}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted uppercase font-bold">Rating</span>
            <span className="text-xs text-amber-600 font-bold">{user.rating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted uppercase font-bold">Solved</span>
            <span className="text-xs text-emerald-600 font-bold">{user.questionsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {friendStatus !== 'SELF' && friendStatus !== 'LOADING' && (
          <>
            {(friendStatus === 'NOT_CONNECTED' || friendStatus === 'REJECTED') && (
              <button
                onClick={() => handleAction('/api/friends/request', 'POST')}
                disabled={isLoading}
                className={`${btnStyle} bg-card text-secondary border-border hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50`}
              >
                Add Friend
              </button>
            )}

            {friendStatus === 'REQUEST_SENT' && (
              <button
                onClick={() => handleAction('/api/friends/request/cancel', 'POST')}
                disabled={isLoading}
                className={`${btnStyle} bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100`}
              >
                Request Sent
              </button>
            )}

            {friendStatus === 'REQUEST_RECEIVED' && (
              <>
                <button
                  onClick={() => handleAction('/api/friends/request/accept', 'POST')}
                  disabled={isLoading}
                  className={`${btnStyle} bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction('/api/friends/request/reject', 'POST')}
                  disabled={isLoading}
                  className={`${btnStyle} bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100`}
                >
                  Reject
                </button>
              </>
            )}

            {friendStatus === 'FRIENDS' && (
              <>
                <Link
                  href={`/chat/${user.id}`}
                  className="p-2.5 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600 text-xs font-bold border border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-200"
                  title="Chat"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleAction('/api/friends/remove', 'DELETE')}
                  disabled={isLoading}
                  className={`${btnStyle} bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300`}
                >
                  Remove
                </button>
              </>
            )}
          </>
        )}

        {/* View Profile Button */}
        <Link
          href={`/profile/${user.id}`}
          className="px-4 py-2 rounded-xl bg-violet-50 text-violet-600 text-xs font-bold border border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-200 whitespace-nowrap"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
