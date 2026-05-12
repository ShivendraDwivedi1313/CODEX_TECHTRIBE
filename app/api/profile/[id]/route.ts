import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            projects: true
          }
        },
        codeforcesStat: true,
        codechefStat: true,
        leetcodeStat: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: `@${user.email.split('@')[0]}`,
      avatar: user.profile?.avatarUrl || `https://picsum.photos/seed/${user.id}/200/200`,
      bio: user.profile?.bio || '',
      joinedDate: user.createdAt.toISOString().split('T')[0],
      headline: user.profile?.headline,
      college: user.profile?.college,
      company: user.profile?.company,
      location: user.profile?.location,
      website: user.profile?.website,
      githubUrl: user.profile?.githubUrl,
      linkedinUrl: user.profile?.linkedinUrl,
      portfolioUrl: user.profile?.portfolioUrl,
      skills: user.profile?.skills || [],
      interests: user.profile?.interests || [],
      points: user.points,
      stats: {
        codeforces: user.codeforcesStat?.points || 0,
        codechef: user.codechefStat?.points || 0,
        leetcode: user.leetcodeStat?.points || 0,
        total: (user.codeforcesStat?.solvedQuestions || 0) + 
               (user.codechefStat?.solvedQuestions || 0) + 
               (user.leetcodeStat?.solvedQuestions || 0)
      },
      handles: {
        codeforces: user.codeforcesStat?.handle || null,
        codechef: user.codechefStat?.handle || null,
        leetcode: user.leetcodeStat?.handle || null,
      },
      posts: user.posts || [],
      projects: user.profile?.projects || []
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
