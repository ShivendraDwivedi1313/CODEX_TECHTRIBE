import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { signOut } from 'next-auth/react'

export async function DELETE() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Hard delete - Prisma cascade will handle all related records
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true, message: 'Account deleted successfully.' })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
