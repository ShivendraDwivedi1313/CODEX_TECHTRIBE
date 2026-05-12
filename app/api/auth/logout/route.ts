import { NextResponse } from 'next/server'

export async function POST() {
  // Remove session cookie(s) by setting them with an expired date
  const response = NextResponse.json({ success: true }, { status: 200 })
  response.cookies.set('session', '', { expires: new Date(0) })
  response.cookies.set('sessionId', '', { expires: new Date(0) })
  // Add any other session cookies you use

  return response
}
