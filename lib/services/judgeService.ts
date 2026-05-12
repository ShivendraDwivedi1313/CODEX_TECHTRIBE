/**
 * Sandboxed code execution via Judge0 CE public API.
 * Replaces the previous unsafe child_process-based execution.
 *
 * For production at scale, self-host Judge0 or use a paid plan
 * to avoid public API rate limits.
 */

export interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number | null
  timedOut: boolean
  runtime: number // ms
  compileError?: string
}

type SupportedLanguage = 'cpp' | 'python' | 'javascript'

// Judge0 CE language IDs
const LANGUAGE_IDS: Record<SupportedLanguage, number> = {
  cpp: 54,        // C++ (GCC 9.2.0)
  python: 71,     // Python 3
  javascript: 93, // Node.js
}

const JUDGE0_BASE = 'https://ce.judge0.com'

/**
 * Submit code to Judge0 and wait for result.
 */
export async function compileAndRun(
  language: string,
  code: string,
  stdin: string,
  timeLimitMs: number = 2000
): Promise<ExecutionResult> {
  const lang = language.toLowerCase() as SupportedLanguage
  const languageId = LANGUAGE_IDS[lang]

  if (!languageId) {
    return {
      stdout: '',
      stderr: `Unsupported language: ${language}. Supported: cpp, python, javascript`,
      exitCode: 1,
      timedOut: false,
      runtime: 0,
    }
  }

  try {
    // Submit to Judge0 with wait=true for synchronous result
    const response = await fetch(
      `${JUDGE0_BASE}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin || '',
          cpu_time_limit: timeLimitMs / 1000, // seconds
          memory_limit: 256000, // KB (256 MB)
        }),
        signal: AbortSignal.timeout(30000), // 30s overall timeout
      }
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`[Judge0] API error: ${response.status} ${errorText}`)
      return {
        stdout: '',
        stderr: `Code execution service error (${response.status}). Please try again.`,
        exitCode: 1,
        timedOut: false,
        runtime: 0,
      }
    }

    const result = await response.json()

    // Judge0 status IDs:
    // 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer,
    // 5=TLE, 6=Compilation Error, 7-12=Runtime Errors
    const statusId = result.status?.id ?? 0
    const timedOut = statusId === 5
    const isCompileError = statusId === 6
    const isRuntimeError = statusId >= 7 && statusId <= 12

    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: statusId === 3 ? 0 : 1,
      timedOut,
      runtime: result.time ? Math.round(parseFloat(result.time) * 1000) : 0,
      compileError: isCompileError ? (result.compile_output || result.stderr || 'Compilation failed') : undefined,
    }
  } catch (error: any) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return {
        stdout: '',
        stderr: 'Code execution timed out. Please try again.',
        exitCode: 1,
        timedOut: true,
        runtime: timeLimitMs,
      }
    }

    console.error('[Judge0] Unexpected error:', error)
    return {
      stdout: '',
      stderr: 'Code execution service unavailable. Please try again.',
      exitCode: 1,
      timedOut: false,
      runtime: 0,
    }
  }
}
