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

interface FailedTestCase { testCase: number; input: string; expectedOutput: string; actualOutput: string; stderr?: string }
interface RunResult { stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; runtime: number }
interface SubmitResult { id: string; verdict: string; passedTestCases: number; totalTestCases: number; runtime?: number; compileError?: string; failedTestCase?: FailedTestCase }
interface PastSubmission {
  id: string; language: string; verdict: string; code: string
  passedTestCases: number; totalTestCases: number
  runtime: number | null; compileError: string | null; submittedAt: string
}

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

  // Left panel tab
  const [leftTab, setLeftTab] = useState<'problem' | 'submissions'>('problem')
  const [pastSubmissions, setPastSubmissions] = useState<PastSubmission[]>([])
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null)

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

  // Fetch submissions when tab changes
  useEffect(() => {
    if (leftTab === 'submissions' && question) {
      setLoadingSubs(true)
      fetch(`/api/submissions?questionId=${question.id}&limit=50`)
        .then(r => r.json())
        .then(data => setPastSubmissions(data.submissions || []))
        .catch(() => {})
        .finally(() => setLoadingSubs(false))
    }
  }, [leftTab, question])

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang)
    if (question) {
      const starter = question.starterCode as Record<string, string>
      setCode(starter[lang] || '')
    }
  }, [question])

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setSubmitResult(null); setActiveTab('output'); setShowPanel(true)
    try {
      const res = await fetch('/api/judge/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, code, input: customInput }) })
      setRunResult(await res.json())
    } catch { setRunResult({ stdout: '', stderr: 'Network error', exitCode: 1, timedOut: false, runtime: 0 }) }
    finally { setRunning(false) }
  }

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitResult(null); setRunResult(null); setActiveTab('output'); setShowPanel(true)
    try {
      const res = await fetch('/api/judge/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionSlug: slug, language, code }) })
      const data = await res.json()
      setSubmitResult(data)
      // Refresh submissions list if on that tab
      if (leftTab === 'submissions' && question) {
        fetch(`/api/submissions?questionId=${question.id}&limit=50`).then(r => r.json()).then(d => setPastSubmissions(d.submissions || []))
      }
    } catch { setSubmitResult({ id: '', verdict: 'RUNTIME_ERROR', passedTestCases: 0, totalTestCases: 0 }) }
    finally { setSubmitting(false) }
  }

  const loadSubmissionCode = (sub: PastSubmission) => {
    setExpandedSubId(expandedSubId === sub.id ? null : sub.id)
  }

  const restoreSubmission = (sub: PastSubmission) => {
    setCode(sub.code)
    setLanguage(sub.language)
    setLeftTab('problem')
  }

  const parseFailedTestCase = (compileError: string | null): FailedTestCase | null => {
    if (!compileError) return null
    try { return JSON.parse(compileError) } catch { return null }
  }

  if (loading) {
    return (<div className="flex min-h-screen bg-surface text-primary"><Sidebar /><main className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full" /></main></div>)
  }
  if (!question) {
    return (<div className="flex min-h-screen bg-surface text-primary"><Sidebar /><main className="flex-1 flex items-center justify-center text-secondary">Question not found</main></div>)
  }

  return (
    <div className="flex min-h-screen bg-surface text-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-screen">
          {/* Left: Problem / Submissions */}
          <div className="lg:w-1/2 overflow-y-auto border-r border-border flex flex-col">
            {/* Left tab bar */}
            <div className="flex border-b border-border bg-card shrink-0 px-4">
              <button onClick={() => setLeftTab('problem')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${leftTab === 'problem' ? 'border-violet-600 text-violet-600' : 'border-transparent text-secondary hover:text-primary'}`}>
                Description
              </button>
              <button onClick={() => setLeftTab('submissions')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${leftTab === 'submissions' ? 'border-violet-600 text-violet-600' : 'border-transparent text-secondary hover:text-primary'}`}>
                Submissions
              </button>
            </div>

            {leftTab === 'problem' ? (
              <div className="p-6 space-y-5 flex-1">
                {/* Title + badges */}
                <div>
                  <h1 className="text-xl font-bold text-primary">{question.title}</h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <DifficultyBadge difficulty={question.difficulty} />
                    {question.tags.map(t => (<span key={t} className="px-2 py-0.5 rounded text-xs font-medium bg-surface text-muted">{t}</span>))}
                    <span className="text-xs text-muted ml-auto">⏱ {question.timeLimit}ms · 💾 {question.memoryLimit}MB</span>
                  </div>
                  {question.solved && (
                    <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                      Solved
                    </div>
                  )}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none"><div className="text-sm text-primary leading-relaxed whitespace-pre-wrap">{question.statement}</div></div>
                <div><h3 className="text-sm font-semibold text-primary mb-1">Input Format</h3><div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border">{question.inputFormat}</div></div>
                <div><h3 className="text-sm font-semibold text-primary mb-1">Output Format</h3><div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border">{question.outputFormat}</div></div>
                <div><h3 className="text-sm font-semibold text-primary mb-1">Constraints</h3><div className="text-sm text-secondary whitespace-pre-wrap bg-surface rounded-xl p-3 border border-border font-mono">{question.constraints}</div></div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-primary">Examples</h3>
                  {question.visibleSamples.map((sample, idx) => (
                    <div key={idx} className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-border">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-muted">Input</span>
                            <button onClick={() => { setCustomInput(sample.input); setActiveTab('input'); setShowPanel(true) }} className="text-[10px] text-violet-600 hover:underline font-medium">Use as input</button>
                          </div>
                          <pre className="text-xs text-primary font-mono whitespace-pre-wrap">{sample.input}</pre>
                        </div>
                        <div className="p-3">
                          <span className="text-xs font-semibold text-muted mb-1 block">Output</span>
                          <pre className="text-xs text-primary font-mono whitespace-pre-wrap">{sample.output}</pre>
                        </div>
                      </div>
                      {sample.explanation && (<div className="px-3 py-2 border-t border-border"><span className="text-xs text-muted">{sample.explanation}</span></div>)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Submissions Tab */
              <div className="flex-1 overflow-y-auto">
                {loadingSubs ? (
                  <div className="flex items-center justify-center py-16"><div className="animate-spin w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full" /></div>
                ) : pastSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted">
                    <svg className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <p className="text-sm">No submissions yet</p>
                    <p className="text-xs mt-1">Submit your code to see results here</p>
                  </div>
                ) : (
                  <div>
                    {/* Header row */}
                    <div className="grid grid-cols-[100px_60px_1fr_70px_90px] gap-2 px-4 py-2 border-b border-border text-[10px] font-semibold text-muted uppercase tracking-wider bg-card sticky top-0">
                      <div>Verdict</div><div>Lang</div><div>Test Cases</div><div>Time</div><div>Submitted</div>
                    </div>
                    {pastSubmissions.map((sub) => {
                      const isExpanded = expandedSubId === sub.id
                      const failedTC = parseFailedTestCase(sub.compileError)
                      const isCompileErr = sub.verdict === 'COMPILATION_ERROR'
                      return (
                        <div key={sub.id} className="border-b border-border">
                          <button onClick={() => loadSubmissionCode(sub)} className="w-full grid grid-cols-[100px_60px_1fr_70px_90px] gap-2 px-4 py-3 text-sm hover:bg-surface transition-colors items-center text-left">
                            <div><VerdictBadge verdict={sub.verdict} /></div>
                            <div className="text-xs text-muted capitalize">{sub.language}</div>
                            <div className="text-xs text-muted">{sub.passedTestCases}/{sub.totalTestCases} passed</div>
                            <div className="text-xs text-muted">{sub.runtime ? `${sub.runtime}ms` : '—'}</div>
                            <div className="text-xs text-muted">{new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3">
                              {/* Failed test case details */}
                              {failedTC && !isCompileErr && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                                  <p className="text-xs font-bold text-rose-500">❌ Failed on Test Case #{failedTC.testCase}</p>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div><span className="text-[10px] font-semibold text-muted uppercase block mb-1">Input</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-32 overflow-y-auto">{failedTC.input}</pre></div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div><span className="text-[10px] font-semibold text-emerald-600 uppercase block mb-1">Expected Output</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-24 overflow-y-auto">{failedTC.expectedOutput}</pre></div>
                                      <div><span className="text-[10px] font-semibold text-rose-500 uppercase block mb-1">Your Output</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-24 overflow-y-auto">{failedTC.actualOutput}</pre></div>
                                    </div>
                                    {failedTC.stderr && <div><span className="text-[10px] font-semibold text-muted uppercase block mb-1">Stderr</span><pre className="text-xs font-mono text-rose-500 bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-24 overflow-y-auto">{failedTC.stderr}</pre></div>}
                                  </div>
                                </div>
                              )}
                              {isCompileErr && sub.compileError && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                                  <p className="text-xs font-bold text-rose-500 mb-2">Compilation Error</p>
                                  <pre className="text-xs font-mono text-rose-500 whitespace-pre-wrap">{sub.compileError}</pre>
                                </div>
                              )}
                              {/* Code viewer */}
                              <div className="rounded-xl border border-border overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-border">
                                  <span className="text-xs font-medium text-secondary capitalize">{sub.language}</span>
                                  <button onClick={() => restoreSubmission(sub)} className="text-[10px] font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                                    ↩ Restore this code
                                  </button>
                                </div>
                                <div style={{ height: 200 }}>
                                  <MonacoEditor height="100%" language={LANGUAGES.find(l => l.key === sub.language)?.monaco || 'cpp'} value={sub.code} theme="vs-dark" options={{ readOnly: true, fontSize: 12, minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: 'on', automaticLayout: true }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Editor + Console */}
          <div className="lg:w-1/2 flex flex-col h-screen">
            {/* Language selector + buttons */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l.key} onClick={() => handleLanguageChange(l.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === l.key ? 'bg-violet-600 text-white' : 'bg-surface text-secondary hover:text-primary hover:bg-border'}`}>{l.label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleRun} disabled={running || submitting} className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-surface text-primary border border-border hover:bg-border transition-all disabled:opacity-50">{running ? '⏳ Running...' : '▶ Run'}</button>
                <button onClick={handleSubmit} disabled={running || submitting} className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all disabled:opacity-50">{submitting ? '⏳ Judging...' : '🚀 Submit'}</button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className={`flex-1 ${showPanel ? 'min-h-0' : ''}`} style={{ minHeight: showPanel ? '40%' : '70%' }}>
              <MonacoEditor height="100%" language={LANGUAGES.find(l => l.key === language)?.monaco || 'cpp'} value={code} onChange={(v) => setCode(v || '')} theme="vs-dark" options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, lineNumbers: 'on', automaticLayout: true }} />
            </div>

            {/* Console Panel */}
            <div className={`border-t border-border bg-card shrink-0 ${showPanel ? '' : 'max-h-10'}`}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <button onClick={() => { setActiveTab('input'); setShowPanel(true) }} className={`text-xs font-medium pb-0.5 transition-colors ${activeTab === 'input' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-secondary hover:text-primary'}`}>Input</button>
                  <button onClick={() => { setActiveTab('output'); setShowPanel(true) }} className={`text-xs font-medium pb-0.5 transition-colors ${activeTab === 'output' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-secondary hover:text-primary'}`}>Output</button>
                </div>
                <button onClick={() => setShowPanel(!showPanel)} className="text-muted hover:text-primary">
                  <svg className={`w-4 h-4 transition-transform ${showPanel ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
              </div>

              {showPanel && (
                <div className="p-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {activeTab === 'input' ? (
                    <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Enter custom input here..." className="w-full h-32 resize-none bg-surface border border-border rounded-lg p-3 text-xs font-mono text-primary placeholder:text-muted focus:outline-none focus:border-violet-600" />
                  ) : (
                    <div className="space-y-3">
                      {/* Submit result with failed test case */}
                      {submitResult && (
                        <div className={`rounded-xl p-4 border ${submitResult.verdict === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20' : 'bg-rose-50 border-rose-200 dark:bg-rose-500/5 dark:border-rose-500/20'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <VerdictBadge verdict={submitResult.verdict} />
                            <span className="text-xs text-muted">{submitResult.passedTestCases}/{submitResult.totalTestCases} test cases passed</span>
                            {submitResult.runtime && <span className="text-xs text-muted">· {submitResult.runtime}ms</span>}
                          </div>
                          {submitResult.compileError && !submitResult.failedTestCase && (
                            <pre className="text-xs font-mono text-rose-600 dark:text-rose-400 whitespace-pre-wrap mt-2">{submitResult.compileError}</pre>
                          )}
                          {submitResult.failedTestCase && (
                            <div className="mt-3 space-y-2 border-t border-border pt-3">
                              <p className="text-xs font-bold text-rose-500">Failed on Test Case #{submitResult.failedTestCase.testCase}</p>
                              <div><span className="text-[10px] font-semibold text-muted uppercase block mb-1">Input</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-24 overflow-y-auto">{submitResult.failedTestCase.input}</pre></div>
                              <div className="grid grid-cols-2 gap-2">
                                <div><span className="text-[10px] font-semibold text-emerald-600 uppercase block mb-1">Expected</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-20 overflow-y-auto">{submitResult.failedTestCase.expectedOutput}</pre></div>
                                <div><span className="text-[10px] font-semibold text-rose-500 uppercase block mb-1">Your Output</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-2 whitespace-pre-wrap max-h-20 overflow-y-auto">{submitResult.failedTestCase.actualOutput}</pre></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Run result */}
                      {runResult && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {runResult.timedOut ? <span className="text-xs font-semibold text-amber-600">⏱ Time Limit Exceeded</span> : runResult.exitCode !== 0 ? <span className="text-xs font-semibold text-rose-600">❌ Error (exit code: {runResult.exitCode})</span> : <span className="text-xs font-semibold text-emerald-600">✅ Executed successfully</span>}
                            <span className="text-xs text-muted">· {runResult.runtime}ms</span>
                          </div>
                          {runResult.stdout && <div><span className="text-xs font-semibold text-muted block mb-1">stdout</span><pre className="text-xs font-mono text-primary bg-surface border border-border rounded-lg p-3 whitespace-pre-wrap">{runResult.stdout}</pre></div>}
                          {runResult.stderr && <div><span className="text-xs font-semibold text-muted block mb-1">stderr</span><pre className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-surface border border-border rounded-lg p-3 whitespace-pre-wrap">{runResult.stderr}</pre></div>}
                          {!runResult.stdout && !runResult.stderr && <div className="text-xs text-muted italic">No output</div>}
                        </div>
                      )}
                      {!runResult && !submitResult && <div className="text-xs text-muted italic">Run or submit your code to see results</div>}
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
