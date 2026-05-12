'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Editor from '@monaco-editor/react'
import { ChatMessageType, ConversationType, CodeSessionType, CodeRunResult } from '@/types/chat'

const STARTER_TEMPLATES: Record<string, string> = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
  python: 'def main():\n    pass\n\nif __name__ == "__main__":\n    main()',
  javascript: 'function main() {\n    \n}\n\nmain();',
  typescript: 'function main() {\n    \n}\n\nmain();',
  java: 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}'
};

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const friendId = params.friendId as string

  // State
  const [conversation, setConversation] = useState<ConversationType | null>(null)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Code Editor State
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isSavingCode, setIsSavingCode] = useState(false)
  const [isRunningCode, setIsRunningCode] = useState(false)
  const [output, setOutput] = useState<CodeRunResult | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch Conversation
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/chat/${friendId}`)
        if (!res.ok) {
          throw new Error('Failed to load conversation')
        }
        const data = await res.json()
        setConversation(data)
        setMessages(data.messages || [])
        
        let initialLang = 'javascript'
        if (data.codeSession && data.codeSession.language) {
          initialLang = data.codeSession.language
        }
        setLanguage(initialLang)

        const localDraft = localStorage.getItem(`editor_draft_${friendId}_${initialLang}`)
        if (localDraft) {
          setCode(localDraft)
        } else if (data.codeSession && data.codeSession.code) {
          setCode(data.codeSession.code)
        } else {
          setCode(STARTER_TEMPLATES[initialLang] || '')
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchConversation()
  }, [friendId])

  // Simple Polling
  useEffect(() => {
    if (!conversation) return

    const interval = setInterval(async () => {
      try {
        // Poll messages
        const msgRes = await fetch(`/api/chat/messages/${conversation.id}`)
        if (msgRes.ok) {
          const freshMessages = await msgRes.json()
          setMessages(freshMessages)
        }
        
        // Poll code session
        const codeRes = await fetch(`/api/chat/code/${conversation.id}`)
        if (codeRes.ok) {
          const session = await codeRes.json()
          if (session && session.code !== code && !isSavingCode) {
            setCode(session.code)
            setLanguage(session.language)
          }
        }
      } catch (e) {
        console.error('Polling error', e)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [conversation, code, isSavingCode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (type: 'TEXT' | 'CODE' = 'TEXT', content: string = newMessage) => {
    if (!content.trim() || !conversation) return

    const optimisticMessage = {
      id: Date.now().toString(),
      content,
      type,
      language: type === 'CODE' ? language : undefined,
      createdAt: new Date(),
      senderId: 'me',
      sender: { name: 'Me' }
    } as any

    setMessages([...messages, optimisticMessage])
    setNewMessage('')

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          content,
          type,
          language: type === 'CODE' ? language : undefined,
        })
      })
    } catch (e) {
      console.error('Failed to send message', e)
    }
  }

  // Handle Code changes with debounce
  useEffect(() => {
    if (!conversation || loading) return

    const timer = setTimeout(async () => {
      setIsSavingCode(true)
      
      // Save locally immediately
      localStorage.setItem(`editor_draft_${friendId}_${language}`, code)

      try {
        await fetch('/api/chat/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversation.id,
            code,
            language,
          })
        })
      } catch (e) {
        console.error('Failed to save code')
      } finally {
        setIsSavingCode(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [code, language, conversation, loading])

  const runCode = async () => {
    setIsRunningCode(true)
    setOutput(null)
    try {
      const res = await fetch('/api/chat/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setOutput({ stderr: data.error || 'Execution failed', stdout: null, compile_output: null, message: null, status: { id: 500, description: 'Error' } })
      } else {
        setOutput(data)
      }
    } catch (e) {
      console.error('Execution error', e)
      setOutput({ stderr: 'Internal Error', stdout: null, compile_output: null, message: null, status: { id: 500, description: 'Error' } })
    } finally {
      setIsRunningCode(false)
    }
  }

  const handleShareCode = () => {
    sendMessage('CODE', code)
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    const localDraft = localStorage.getItem(`editor_draft_${friendId}_${newLang}`)
    if (localDraft) {
      setCode(localDraft)
    } else {
      setCode(STARTER_TEMPLATES[newLang] || '')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleClear = () => {
    setCode('')
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to the starter template?")) {
      setCode(STARTER_TEMPLATES[language] || '')
      localStorage.removeItem(`editor_draft_${friendId}_${language}`)
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"></div>
    </div>
  )
  if (error) return (
    <div className="flex h-screen items-center justify-center bg-surface text-red-500 font-bold p-8 text-center max-w-lg mx-auto">
      {error}
      <Link href="/friends" className="ml-4 block mt-4 px-4 py-2 bg-card text-primary rounded-lg">Back to Friends</Link>
    </div>
  )

  const friendName = conversation?.participants.find(p => p.user.id === friendId)?.user.name || 'Friend'

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-surface overflow-hidden font-sans">
      
      {/* LEFT PANEL: Chat */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px] h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col shadow-sm z-10 flex-shrink-0">
        
        <div className="p-4 border-b border-border flex items-center justify-between bg-card shadow-sm z-10">
          <div className="flex items-center gap-3">
             <Link href="/friends" className="p-2 -ml-2 text-muted hover:text-secondary hover:bg-border rounded-full transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </Link>
             <div>
               <h2 className="font-bold text-primary leading-tight">{friendName}</h2>
               <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Debug Room connected</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
          {messages.map((msg, i) => {
            const isMe = msg.senderId !== friendId
            return (
              <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full group`}>
                <span className="text-[9px] text-muted font-bold mb-1 px-1 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  {isMe ? 'You' : (msg.sender?.name || friendName)}
                </span>
                <div className={`
                  ${msg.type === 'CODE' ? 'font-mono text-xs w-full overflow-x-auto rounded-xl p-3 shadow-md' : 'rounded-2xl px-4 py-2.5 max-w-[85%] shadow-sm text-sm'}
                  ${isMe && msg.type !== 'CODE' ? 'bg-violet-600 text-white rounded-br-sm' : ''}
                  ${!isMe && msg.type !== 'CODE' ? 'bg-card border border-border text-primary rounded-bl-sm' : ''}
                  ${msg.type === 'CODE' ? 'bg-[#1e1e1e] text-muted border border-gray-800' : ''}
                `}>
                  {msg.type === 'CODE' ? (
                    <div>
                      <div className="text-[9px] text-violet-400 mb-2 font-bold uppercase tracking-widest border-b border-gray-800 pb-1 w-max">Shared Snippet • {msg.language || 'code'}</div>
                      <pre className="whitespace-pre-wrap font-mono"><code>{msg.content}</code></pre>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-card border-t border-border z-10 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2 relative items-end"
          >
            <textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message..." 
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none max-h-32 min-h-[44px]"
              rows={1}
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-violet-600 text-white rounded-xl w-11 h-11 flex items-center justify-center hover:bg-violet-700 disabled:opacity-50 disabled:bg-border transition-all shadow-sm flex-shrink-0"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: Editor + Output */}
      <div className="flex-1 flex flex-col min-w-0 h-1/2 lg:h-full">
        
        {/* TOP RIGHT: Editor */}
        <div className="flex-[5] flex flex-col bg-[#1e1e1e] border-b border-gray-900 shadow-2xl z-20 overflow-hidden relative">
          <div className="h-14 bg-[#141414] border-b border-gray-800/80 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#2d2d2d] text-gray-200 text-xs font-medium rounded-lg px-3 py-1.5 outline-none border border-gray-700 focus:border-violet-500 transition-colors cursor-pointer appearance-none pr-8 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <button onClick={handleReset} title="Reset to Template" className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={handleClear} title="Clear Code" className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={handleCopy} title="Copy Code" className="p-1.5 text-gray-400 hover:text-white transition-colors mr-2 lg:mr-4 border-r border-gray-700 pr-3 lg:pr-5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <button 
                onClick={handleShareCode}
                className="px-4 py-1.5 bg-[#252525] hover:bg-[#353535] text-muted text-xs font-bold rounded-lg border border-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Snippet
              </button>
              <button 
                onClick={runCode}
                disabled={isRunningCode}
                className="px-5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isRunningCode ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
                Run Code
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all"
              }}
            />
          </div>
        </div>

        {/* BOTTOM RIGHT: Output */}
        <div className="flex-[2] bg-[#090909] text-muted font-mono text-sm overflow-y-auto z-10 flex flex-col min-h-[150px]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-[#111111] sticky top-0 shadow-sm z-10">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-200 font-bold tracking-widest uppercase text-[10px]">Console output</span>
          </div>

          <div className="p-4 flex-1">
            {!output && <p className="text-secondary">Waiting for execution...</p>}
            
            {output && (
              <div className="space-y-5">
                <div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${output.status?.id <= 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {output.status?.description || 'Error'}
                  </span>
                </div>
                
                {output.compile_output && (
                  <div className="text-amber-400">
                    <p className="text-secondary text-[10px] mb-2 uppercase tracking-widest font-bold border-b border-gray-800 pb-1 w-max">Compilation / Setup</p>
                    <pre className="whitespace-pre-wrap">{output.compile_output}</pre>
                  </div>
                )}
                
                {output.stderr && (
                  <div className="text-red-400">
                    <p className="text-secondary text-[10px] mb-2 uppercase tracking-widest font-bold border-b border-gray-800 pb-1 w-max">Standard Error</p>
                    <pre className="whitespace-pre-wrap">{output.stderr}</pre>
                  </div>
                )}
                
                {output.stdout && (
                  <div className="text-gray-200">
                    <p className="text-secondary text-[10px] mb-2 uppercase tracking-widest font-bold border-b border-gray-800 pb-1 w-max">Standard Output</p>
                    <pre className="whitespace-pre-wrap">{output.stdout}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
