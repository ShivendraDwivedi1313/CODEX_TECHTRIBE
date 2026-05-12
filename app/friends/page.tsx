'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import SearchResults from '@/components/search/SearchResults'
import { User } from '@/types/user'

export default function FriendsPage() {
  const [friends, setFriends] = useState<User[]>([])
  const [pendingRequests, setPendingRequests] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsRes, requestsRes] = await Promise.all([
          fetch('/api/friends'),
          fetch('/api/friends/requests/received')
        ])
        
        if (friendsRes.ok) {
          setFriends(await friendsRes.json())
        }
        
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json()
          const mappedRequests = requestsData.map((req: any) => ({
             id: req.senderId,
             name: req.name,
             username: req.username.replace('@', ''),
             avatar: req.avatar,
             rating: 0,
             questionsCount: 0
          }))
          setPendingRequests(mappedRequests)
        }
      } catch (error) {
        console.error('Fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 py-4 flex items-center justify-between md:pl-5 pl-16">
          <h1 className="text-primary font-bold text-xl tracking-tight">Friends</h1>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            T
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary tracking-tight">Your Network</h2>
              <p className="text-secondary">Manage your connections and pending requests here.</p>
            </div>

            {pendingRequests.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-1">
                  Pending Requests ({pendingRequests.length})
                </h3>
                <SearchResults users={pendingRequests} loading={loading} query="pending-requests" />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest px-1">
                Connected Friends
              </h3>
              <SearchResults users={friends} loading={loading} query="friends-list" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )

}
