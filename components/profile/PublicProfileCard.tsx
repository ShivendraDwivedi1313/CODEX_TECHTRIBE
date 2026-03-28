'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface QuestionStatsData {
  total: number
  codeforces: number
  codechef: number
  leetcode: number
}

interface CodingHandles {
  codeforces: string | null
  codechef: string | null
  leetcode: string | null
}

interface PublicProfileCardProps {
  userId: string
  profile: any
  initialStats?: QuestionStatsData
  initialHandles?: CodingHandles
}

export default function PublicProfileCard({ userId, profile, initialStats, initialHandles }: PublicProfileCardProps) {
  const [stats, setStats] = useState<QuestionStatsData | null>(initialStats || null)
  const [handles, setHandles] = useState<CodingHandles | null>(initialHandles || null)
  const [loading, setLoading] = useState(!initialStats || !initialHandles)

  useEffect(() => {
    if (initialStats && initialHandles) return
    
    const load = async () => {
      try {
        const [statsRes, handlesRes] = await Promise.all([
          fetch(`/api/profile/${userId}/stats`),
          fetch(`/api/profile/${userId}/coding-handles`),
        ])
        const [statsData, handlesData] = await Promise.all([
          statsRes.json(),
          handlesRes.json(),
        ])
        setStats(statsData)
        setHandles(handlesData)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {/* Left – Profile Info */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-4">
            {profile.avatar && (
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-violet-200"
              />
            )}
          </div>
          <h2 className="text-primary font-bold text-xl mb-1">{profile.name}</h2>
          <p className="text-secondary text-sm mb-3">{profile.username}</p>
          
          {profile.headline && (
            <p className="text-primary text-sm mb-3">{profile.headline}</p>
          )}

          {profile.bio && (
            <p className="text-secondary text-xs mb-4 max-w-xs">{profile.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4 text-xs text-secondary">
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.company && <span>💼 {profile.company}</span>}
            {profile.college && <span>🎓 {profile.college}</span>}
          </div>

          {/* Social Links */}
          {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl || profile.website) && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-skeleton text-primary text-xs font-medium hover:bg-border transition-colors"
                >
                  GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-skeleton text-primary text-xs font-medium hover:bg-border transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-skeleton text-primary text-xs font-medium hover:bg-border transition-colors"
                >
                  Portfolio
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-skeleton text-primary text-xs font-medium hover:bg-border transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Center – Question Stats */}
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-12 bg-skeleton rounded w-3/4 mx-auto" />
              <div className="h-8 bg-skeleton rounded w-1/2 mx-auto" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-black text-violet-600 mb-1">{stats.total}</div>
                <p className="text-secondary text-sm font-semibold">Questions Solved</p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{stats.codeforces}</div>
                  <p className="text-xs text-secondary">CodeForces</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{stats.codechef}</div>
                  <p className="text-xs text-secondary">CodeChef</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{stats.leetcode}</div>
                  <p className="text-xs text-secondary">LeetCode</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right – Coding Handles */}
        <div className="space-y-3">
          {handles ? (
            <>
              {handles.leetcode && (
                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-700 font-semibold mb-1">LeetCode</p>
                  <a
                    href={`https://leetcode.com/${handles.leetcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium break-all"
                  >
                    {handles.leetcode}
                  </a>
                </div>
              )}
              {handles.codeforces && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold mb-1">CodeForces</p>
                  <a
                    href={`https://codeforces.com/profile/${handles.codeforces}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    {handles.codeforces}
                  </a>
                </div>
              )}
              {handles.codechef && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <p className="text-xs text-orange-700 font-semibold mb-1">CodeChef</p>
                  <a
                    href={`https://www.codechef.com/users/${handles.codechef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium break-all"
                  >
                    {handles.codechef}
                  </a>
                </div>
              )}
              {!handles.leetcode && !handles.codeforces && !handles.codechef && (
                <p className="text-secondary text-sm italic">No coding handles linked</p>
              )}
            </>
          ) : null}
        </div>
      </div>

          {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
        <div className="mt-8 pt-8 border-t border-border">
          {(profile.skills as string[])?.length > 0 && (
            <div className="mb-6">
              <p className="text-primary text-xs font-bold uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(profile.skills as string[]).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-violet-100 text-violet-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(profile.interests as string[])?.length > 0 && (
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-wide mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {(profile.interests as string[]).map((interest: string) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
