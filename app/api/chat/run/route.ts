import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/session'

// Mapping Judge0 Language IDs
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 93, // Node.js
  python: 71,  // Python 3
  cpp: 54,     // C++
  java: 62,    // Java
  typescript: 94, // TypeScript
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code, language = 'javascript' } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()] || 93

    // Use Judge0 CE public API
    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      status: result.status,
    })
  } catch (error) {
    console.error('Error running code:', error)
    return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 })
  }
}
