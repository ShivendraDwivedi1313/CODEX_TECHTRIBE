import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { compileAndRun } from '@/lib/services/judgeService'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 code executions per minute
    const rl = rateLimit(`judge-run:${userId}`, { limit: 10, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before running code again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const body = await req.json()
    const { language, code, input } = body

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 })
    }

    const supportedLangs = ['cpp', 'python', 'javascript']
    if (!supportedLangs.includes(language.toLowerCase())) {
      return NextResponse.json({
        error: `Unsupported language. Supported: ${supportedLangs.join(', ')}`,
      }, { status: 400 })
    }

    const result = await compileAndRun(language, code, input || '', 5000)

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      timedOut: result.timedOut,
      runtime: result.runtime,
    })
  } catch (error) {
    console.error('Error running code:', error)
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 })
  }
}
