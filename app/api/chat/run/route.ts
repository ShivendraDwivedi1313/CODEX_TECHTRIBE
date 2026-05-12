import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'
import { compileAndRun } from '@/lib/services/judgeService'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 code runs per minute
    const rl = rateLimit(`chat-run:${userId}`, { limit: 10, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before running code again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    const { code, language = 'javascript' } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const supportedLangs = ['cpp', 'python', 'javascript']
    if (!supportedLangs.includes(language.toLowerCase())) {
      return NextResponse.json({
        error: `Unsupported language. Supported: ${supportedLangs.join(', ')}`,
      }, { status: 400 })
    }

    const result = await compileAndRun(language, code, '', 5000)

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compileError || null,
      status: {
        id: result.exitCode === 0 ? 3 : result.timedOut ? 5 : 11,
        description: result.exitCode === 0 ? 'Accepted' : result.timedOut ? 'Time Limit Exceeded' : 'Runtime Error',
      },
    })
  } catch (error) {
    console.error('Error running code:', error)
    return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 })
  }
}
