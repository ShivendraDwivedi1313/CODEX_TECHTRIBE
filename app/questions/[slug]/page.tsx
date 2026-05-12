'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import { DifficultyBadge, VerdictBadge } from '@/components/questions/Badges'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Sample { input: string; output: string; explanation?: string }
interface Question {
  id: string; title: string; slug: string; difficulty: string; tags: string[]
  statement: string; inputFormat: string; outputFormat: string; constraints: string
  explanation?: string; visibleSamples: Sample[]; starterCode: Record<string, string>
  timeLimit: number; memoryLimit: number; solved: boolean; attempts: number
}

interface RunResult { stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; runtime: number }
interface SubmitResult { id: string; verdict: string; passedTestCases: number; totalTestCases: number; runtime?: number; compileError?: string }

const LANGUAGES = [
  { key: 'cpp', label: 'C++', monaco: 'cpp' },
  { key: 'python', label: 'Python', monaco: 'python' },
  { key: 'javascript', label: 'JavaScript', monaco: 'javascript' },
]

export default function QuestionDetailPage() {
  const { slug } = useParams() as { slug: string }
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('cpp')
  const [code, setCode] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  // Fetch question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setQuestion(data)
          const starter = data.starterCode as Record<string, string>
          setCode(starter[language] || starter.cpp || '')
          if (data.visibleSamples?.[0]) {
            setCustomInput(data.visibleSamples[0].input)
          }
        }
      } catch (e) {
        console.error('Failed to fetch question:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestion()
  }, [slug])

  // Update code when language changes
  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang)
    if (question) {
      const starter = question.starterCode as Record<string, string>
      setCode(starter[lang] || '')
    }
  }, [question])

  // Run code
  const handleRun = async () => {
    setRunning(true)
    setRunResult(null)
    setSubmitResult(null)
    setActiveTab('output')
    setShowPanel(true)
    try {
      const res = await fetch('/api/judge/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input: customInput }),
      })
      const data = await res.json()
      setRunResult(data)
    } catch (e) {
      setRunResult({ stdout: '', stderr: 'Network error', exitCode: 1, timedOut: false, runtime: 0 })
    } finally {
      setRunning(false)
    }
  }

  // Submit code
  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitResult(null)
    setRunResult(null)
    setActiveTab('output')
    setShowPanel(true)
    try {
      const res = await fetch('/api/judge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionSlug: slug, language, code }),
      })
      const data = await res.json()
      setSubmitResult(data)
    } catch (e) {
      setSubmitResult({ id: '', verdict: 'RUNTIME_ERROR', passedTestCases: 0, totalTestCases: 0 })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface text-primary">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full" />
        </main>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="flex min-h-screen bg-surface text-primary">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-secondary">
          Question not found
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface text-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left: Problem Statement */}
          <div className="lg:w-1/2 overflow-y-auto border-r border-border p-6 space-y-5">
            {/* Title + badges */}
            <div>
              <h1 className="text-xl font-bold text-primary">{question.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <DifficultyBadge difficulty={question.difficulty} />
                {question.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-xs font-medium bg-surface text-muted">{t}</span>
                ))}
                <span className="text-xs text-muted ml-auto">
                  ⏱ {question.timeLimit}ms · 💾 {question.memoryLimit}MB
                </span>
              </div>
              {question.solved && (
                <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Solved
                </div>
              )}
            </div>

            {/* Statement */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-primary leading-relaxed whitespace-pre-wrap">{question.statement}</div>
            </div>

            {/* Input Format */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">Input Format</h3>
              <div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border">{question.inputFormat}</div>
            </div>

            {/* Output Format */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">Output Format</h3>
              <div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border">{question.outputFormat}</div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">Constraints</h3>
              <div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border font-mono">{question.constraints}</div>
            </div>

            {/* Visible Samples */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary">Examples</h3>
              {question.visibleSamples.map((sample, idx) => (
                <div key={idx} className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-muted">Input</span>
                        <button
                          onClick={() => { setCustomInput(sample.input); setActiveTab('input'); setShowPanel(true) }}
                          className="text-[10px] text-violet-600 hover:underline font-medium"
                        >
                          Use as input
                        </button>
                      </div>
                      <pre className="text-xs text-primary font-mono whitespace-pre-wrap">{sample.input}</pre>
                    </div>
                    <div className="p-3">
                      <span className="text-xs font-semibold text-muted mb-1 block">Output</span>
                      <pre className="text-xs text-primary font-mono whitespace-pre-wrap">{sample.output}</pre>
                    </div>
                  </div>
                  {sample.explanation && (
                    <div className="px-3 py-2 border-t border-border">
                      <span className="text-xs text-muted">{sample.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Editor + Console */}
          <div className="lg:w-1/2 flex flex-col h-screen">
            {/* Language selector + buttons */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => handleLanguageChange(l.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      language === l.key
                        ? 'bg-violet-600 text-white'
                        : 'bg-surface text-secondary hover:text-primary hover:bg-border'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={running || submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-surface text-primary border border-border hover:bg-border transition-all disabled:opacity-50"
                >
                  {running ? '⏳ Running...' : '▶ Run'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={running || submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  {submitting ? '⏳ Judging...' : '🚀 Submit'}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className={`flex-1 ${showPanel ? 'min-h-0' : ''}`} style={{ minHeight: showPanel ? '40%' : '70%' }}>
              <MonacoEditor
                height="100%"
                language={LANGUAGES.find(l => l.key === language)?.monaco || 'cpp'}
                value={code}
                onChange={(v) => setCode(v || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Console Panel */}
            <div className={`border-t border-border bg-card shrink-0 ${showPanel ? '' : 'max-h-10'}`}>
              {/* Console header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setActiveTab('input'); setShowPanel(true) }}
                    className={`text-xs font-medium pb-0.5 transition-colors ${activeTab === 'input' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-secondary hover:text-primary'}`}
                  >
                    Input
                  </button>
                  <button
                    onClick={() => { setActiveTab('output'); setShowPanel(true) }}
                    className={`text-xs font-medium pb-0.5 transition-colors ${activeTab === 'output' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-secondary hover:text-primary'}`}
                  >
                    Output
                  </button>
                </div>
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="text-muted hover:text-primary"
                >
                  <svg className={`w-4 h-4 transition-transform ${showPanel ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>

              {showPanel && (
                <div className="p-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {activeTab === 'input' ? (
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter custom input here..."
                      className="w-full h-32 resize-none bg-surface border border-border rounded-lg p-3 text-xs font-mono text-primary placeholder:text-muted focus:outline-none focus:border-violet-600"
                    />
                  ) : (
                    <div className="space-y-3">
                      {/* Submit result */}
                      {submitResult && (
                        <div className={`rounded-xl p-4 border ${submitResult.verdict === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-rose-50 border-rose-200 dark:bg-rose-500/5 dark:border-rose-500/20'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <VerdictBadge verdict={submitResult.verdict} />
                            <span className="text-xs text-muted">
                              {submitResult.passedTestCases}/{submitResult.totalTestCases} test cases passed
                            </span>
                            {submitResult.runtime && (
                              <span className="text-xs text-muted">· {submitResult.runtime}ms</span>
                            )}
                          </div>
                          {submitResult.compileError && (
                            <pre className="text-xs font-mono text-rose-600 dark:text-rose-400 whitespace-pre-wrap mt-2">{submitResult.compileError}</pre>
                          )}
                        </div>
                      )}

                      {/* Run result */}
                      {runResult && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {runResult.timedOut ? (
                              <span className="text-xs font-semibold text-amber-600">⏱ Time Limit Exceeded</span>
                            ) : runResult.exitCode !== 0 ? (
                              <span className="text-xs font-semibold text-rose-600">❌ Error (exit code: {runResult.exitCode})</span>
                            ) : (
                              <span className="text-xs font-semibold text-emerald-600">✅ Executed successfully</span>
                            )}
                            <span className="text-xs text-muted">· {runResult.runtime}ms</span>
                          </div>
                          {runResult.stdout && (
                            <div>
                              <span className="text-xs font-semibold text-muted block mb-1">stdout</span>
                              <pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-3 whitespace-pre-wrap">{runResult.stdout}</pre>
                            </div>
                          )}
                          {runResult.stderr && (
                            <div>
                              <span className="text-xs font-semibold text-muted block mb-1">stderr</span>
                              <pre className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-surface border border-border rounded-lg p-3 whitespace-pre-wrap">{runResult.stderr}</pre>
                            </div>
                          )}
                          {!runResult.stdout && !runResult.stderr && (
                            <div className="text-xs text-muted italic">No output</div>
                          )}
                        </div>
                      )}

                      {!runResult && !submitResult && (
                        <div className="text-xs text-muted italic">Run or submit your code to see results</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
