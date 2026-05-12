import { execFile, exec } from 'child_process'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { tmpdir } from 'os'

export interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number | null
  timedOut: boolean
  runtime: number // ms
}

type SupportedLanguage = 'cpp' | 'python' | 'javascript'

const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  extension: string
  compile?: (src: string, out: string) => string[]
  run: (src: string, out: string) => string[]
}> = {
  cpp: {
    extension: '.cpp',
    compile: (src, out) => ['g++', ['-std=c++17', '-O2', '-o', out, src]].flat() as any,
    run: (_src, out) => [out],
  },
  python: {
    extension: '.py',
    run: (src) => ['python3', src],
  },
  javascript: {
    extension: '.js',
    run: (src) => ['node', src],
  },
}

function execPromise(
  cmd: string,
  args: string[],
  options: { timeout: number; input?: string }
): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, {
      timeout: options.timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
      encoding: 'utf-8',
    }, (error, stdout, stderr) => {
      const timedOut = error?.killed === true || (error as any)?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'
      resolve({
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: error ? (error as any).code ?? 1 : 0,
        timedOut: !!timedOut,
      })
    })

    // Write stdin if provided
    if (options.input !== undefined && child.stdin) {
      child.stdin.write(options.input)
      child.stdin.end()
    }
  })
}

function compilePromise(
  fullCmd: string,
  timeout: number
): Promise<{ success: boolean; stderr: string }> {
  return new Promise((resolve) => {
    exec(fullCmd, { timeout, maxBuffer: 5 * 1024 * 1024 }, (error, _stdout, stderr) => {
      resolve({ success: !error, stderr: stderr || '' })
    })
  })
}

/**
 * Compile (if needed) and execute code with given stdin.
 */
export async function compileAndRun(
  language: string,
  code: string,
  stdin: string,
  timeLimitMs: number = 2000
): Promise<ExecutionResult> {
  const lang = language.toLowerCase() as SupportedLanguage
  const config = LANGUAGE_CONFIG[lang]
  if (!config) {
    return {
      stdout: '',
      stderr: `Unsupported language: ${language}. Supported: cpp, python, javascript`,
      exitCode: 1,
      timedOut: false,
      runtime: 0,
    }
  }

  const id = randomUUID()
  const workDir = join(tmpdir(), 'techtribe-judge', id)
  await mkdir(workDir, { recursive: true })

  const srcFile = join(workDir, `solution${config.extension}`)
  const outFile = join(workDir, 'solution')

  try {
    // Write source code
    await writeFile(srcFile, code, 'utf-8')

    // Compile step (C++ only)
    if (config.compile) {
      const compileCmd = `g++ -std=c++17 -O2 -o "${outFile}" "${srcFile}"`
      const compileResult = await compilePromise(compileCmd, 15000)
      if (!compileResult.success) {
        return {
          stdout: '',
          stderr: compileResult.stderr,
          exitCode: 1,
          timedOut: false,
          runtime: 0,
        }
      }
    }

    // Run step
    const runArgs = config.run(srcFile, outFile)
    const cmd = runArgs[0]
    const args = runArgs.slice(1)

    const start = Date.now()
    const result = await execPromise(cmd, args, {
      timeout: timeLimitMs + 500, // slight buffer over problem limit
      input: stdin,
    })
    const runtime = Date.now() - start

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: typeof result.exitCode === 'number' ? result.exitCode : 1,
      timedOut: result.timedOut || runtime > timeLimitMs,
      runtime,
    }
  } finally {
    // Cleanup temp files
    const cleanup = async () => {
      try { await unlink(srcFile) } catch {}
      try { await unlink(outFile) } catch {}
      try {
        const { rmdir } = await import('fs/promises')
        await rmdir(workDir)
      } catch {}
    }
    cleanup() // fire-and-forget
  }
}
