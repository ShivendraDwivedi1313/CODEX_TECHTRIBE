import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/session'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const userId = await getCurrentUserId()

    const question = await prisma.question.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        statement: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        explanation: true,
        visibleSamples: true,
        starterCode: true,
        timeLimit: true,
        memoryLimit: true,
        createdAt: true,
        // NOTE: hiddenTestCases and referenceSolution are NOT exposed
        ...(userId ? {
          stats: {
            where: { userId },
            select: { solved: true, attempts: true, bestVerdict: true },
          },
        } : {}),
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const result = {
      ...question,
      solved: (question as any).stats?.[0]?.solved ?? false,
      attempts: (question as any).stats?.[0]?.attempts ?? 0,
      bestVerdict: (question as any).stats?.[0]?.bestVerdict ?? null,
      stats: undefined,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 })
  }
}
