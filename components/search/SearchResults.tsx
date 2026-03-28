'use client'

import { User } from '@/types/user'
import UserCard from './UserCard'

interface SearchResultsProps {
  users: User[]
  loading: boolean
  query: string
}

function SkeletonResults() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-skeleton rounded-2xl border border-border" />
      ))}
    </div>
  )
}

export default function SearchResults({ users, loading, query }: SearchResultsProps) {
  if (loading) return <SkeletonResults />

  if (query && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-lg font-medium">No users found for &quot;{query}&quot;</p>
        <p className="text-sm">Try searching for a different username or name.</p>
      </div>
    )
  }

  if (!query && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted">
        <p className="text-lg font-medium">Start typing to search for people</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
