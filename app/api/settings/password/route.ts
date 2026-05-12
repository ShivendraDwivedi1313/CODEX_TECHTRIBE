import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import bcrypt from 'bcrypt'

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // OAuth users (no password set) — allow them to SET a password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required.' }, { status: 400 })
      }
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}
