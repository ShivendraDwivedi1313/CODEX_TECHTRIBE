import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'
import { compileAndRun } from '@/lib/services/judgeService'
import { compareOutput } from '@/lib/services/compareOutput'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 submissions per minute
    const rl = rateLimit(`judge-submit:${userId}`, { limit: 10, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before submitting again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const body = await req.json()
    const { questionSlug, language, code } = body

    if (!questionSlug || !language || !code) {
      return NextResponse.json({
        error: 'questionSlug, language, and code are required',
      }, { status: 400 })
    }

    const supportedLangs = ['cpp', 'python', 'javascript']
    if (!supportedLangs.includes(language.toLowerCase())) {
      return NextResponse.json({
        error: `Unsupported language. Supported: ${supportedLangs.join(', ')}`,
      }, { status: 400 })
    }

    // Fetch question with hidden test cases
    const question = await prisma.question.findUnique({
      where: { slug: questionSlug },
      select: {
        id: true,
        hiddenTestCases: true,
        timeLimit: true,
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const testCases = question.hiddenTestCases as Array<{ input: string; expectedOutput: string }>
    const totalTestCases = testCases.length

    // Quick compile check with first test case
    const firstResult = await compileAndRun(language, code, testCases[0]?.input || '', question.timeLimit)

    if (firstResult.stderr && firstResult.exitCode !== 0 && !firstResult.timedOut) {
      // Check if it's a compile error (stderr has content and no stdout at all)
      const isCompileError = firstResult.stdout === '' && firstResult.stderr.length > 0

      if (isCompileError) {
        const submission = await prisma.submission.create({
          data: {
            userId,
            questionId: question.id,
            language,
            code,
            verdict: 'COMPILATION_ERROR',
            passedTestCases: 0,
            totalTestCases,
            compileError: firstResult.stderr,
          },
        })

        // Update user stats
        await upsertStats(userId, question.id, 'COMPILATION_ERROR')

        return NextResponse.json({
          id: submission.id,
          verdict: 'COMPILATION_ERROR',
          passedTestCases: 0,
          totalTestCases,
          compileError: firstResult.stderr,
        })
      }
    }

    // Run against all test cases
    let passedTestCases = 0
    let verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED' = 'ACCEPTED'
    let totalRuntime = 0
    let failedTestCaseInfo: { testCase: number; input: string; expectedOutput: string; actualOutput: string; stderr?: string } | null = null

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i]
      const result = i === 0 ? firstResult : await compileAndRun(language, code, tc.input, question.timeLimit)
      totalRuntime += result.runtime

      if (result.timedOut) {
        verdict = 'TIME_LIMIT_EXCEEDED'
        failedTestCaseInfo = {
          testCase: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '(Time Limit Exceeded)',
        }
        break
      }

      if (result.exitCode !== 0) {
        verdict = 'RUNTIME_ERROR'
        failedTestCaseInfo = {
          testCase: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout || '',
          stderr: result.stderr || '',
        }
        break
      }

      if (compareOutput(result.stdout, tc.expectedOutput)) {
        passedTestCases++
      } else {
        verdict = 'WRONG_ANSWER'
        failedTestCaseInfo = {
          testCase: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout.trim(),
        }
        break
      }
    }

    // Serialize failed test case info into compileError field for storage
    const errorDetail = failedTestCaseInfo ? JSON.stringify(failedTestCaseInfo) : null

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        questionId: question.id,
        language,
        code,
        verdict,
        passedTestCases,
        totalTestCases,
        runtime: Math.round(totalRuntime / totalTestCases),
        compileError: errorDetail,
      },
    })

    // Update user question stats
    await upsertStats(userId, question.id, verdict)

    return NextResponse.json({
      id: submission.id,
      verdict: submission.verdict,
      passedTestCases: submission.passedTestCases,
      totalTestCases: submission.totalTestCases,
      runtime: submission.runtime,
      failedTestCase: failedTestCaseInfo,
    })
  } catch (error) {
    console.error('Error submitting code:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}

async function upsertStats(userId: string, questionId: string, verdict: string) {
  const existing = await prisma.userQuestionStats.findUnique({
    where: { userId_questionId: { userId, questionId } },
  })

  const isSolved = verdict === 'ACCEPTED'
  const bestVerdict = getBetterVerdict(existing?.bestVerdict || null, verdict)

  await prisma.userQuestionStats.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: {
      userId,
      questionId,
      solved: isSolved,
      attempts: 1,
      bestVerdict: bestVerdict as any,
      lastSubmittedAt: new Date(),
    },
    update: {
      attempts: { increment: 1 },
      solved: isSolved || existing?.solved || false,
      bestVerdict: bestVerdict as any,
      lastSubmittedAt: new Date(),
    },
  })
}

function getBetterVerdict(current: string | null, incoming: string): string {
  const rank: Record<string, number> = {
    ACCEPTED: 5,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 3,
    RUNTIME_ERROR: 2,
    COMPILATION_ERROR: 1,
  }
  if (!current) return incoming
  return (rank[incoming] || 0) >= (rank[current] || 0) ? incoming : current
}
