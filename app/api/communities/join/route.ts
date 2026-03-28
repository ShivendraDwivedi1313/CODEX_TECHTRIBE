import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { communityId } = await request.json()
    if (!communityId) {
      return NextResponse.json({ message: 'Community ID is required' }, { status: 400 })
    }

    // Check if already a member
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ message: 'Already a member' }, { status: 400 })
    }

    // Join community
    await prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: 'MEMBER'
      }
    })

    return NextResponse.json({ message: 'Joined successfully' }, { status: 201 })
  } catch (error) {
    console.error('Community join error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
