'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/types/message'
import { Channel } from '@/types/channel'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface ChatWindowProps {
  channel: Channel | null
  loading: boolean
}

function SkeletonMessages() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      {[false, true, false, false, true].map((isRight, i) => (
        <div key={i} className={`flex gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-skeleton flex-shrink-0" />
          <div className={`space-y-1.5 ${isRight ? 'items-end' : 'items-start'}`}>
            <div className="h-3 w-16 bg-skeleton rounded" />
            <div className={`h-8 bg-surface rounded-2xl ${isRight ? 'w-40' : 'w-52'}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ChatWindow({ channel, loading: channelLoading }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchTimeRef = useRef<number>(0)

  const fetchMessages = async () => {
    if (!channel) return
    try {
      const res = await fetch(`/api/messages?channelId=${channel.id}`)
      const data: Message[] = await res.json()
      
      // Merge new messages with existing ones, avoiding duplicates
      setMessages((prevMessages) => {
        const existingIds = new Set(prevMessages.map((m) => m.id))
        const newMessages = data.filter((m) => !existingIds.has(m.id))
        return newMessages.length > 0 ? [...prevMessages, ...newMessages] : prevMessages
      })
      
      lastFetchTimeRef.current = Date.now()
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    if (!channel) return

    const initialFetch = async () => {
      setLoadingMessages(true)
      try {
        const res = await fetch(`/api/messages?channelId=${channel.id}`)
        const data: Message[] = await res.json()
        setMessages(data)
        lastFetchTimeRef.current = Date.now()
      } catch {
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    initialFetch()

    // Set up polling interval (2 seconds)
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages()
    }, 2000)

    // Cleanup interval on unmount or channel change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [channel?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!channel) return
    setSending(true)

    // Optimistic update
    const optimistic: Message = {
      id: `temp_${Date.now()}`,
      user: 'You',
      text,
      timestamp: new Date().toISOString(),
      channelId: channel.id,
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, channelId: channel.id }),
      })
      const saved: Message = await res.json()
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)))
    } catch {
      // keep the optimistic message
    } finally {
      setSending(false)
    }
  }

  if (channelLoading) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-skeleton" />
          <div className="h-4 w-28 bg-skeleton rounded" />
        </div>
        <div className="flex-1 overflow-hidden"><SkeletonMessages /></div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted bg-card">
        <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <p className="text-sm">Select a channel to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border text-lg shadow-sm">
            {channel.logo || '💬'}
          </span>
          <div>
            <h3 className="text-primary text-sm font-bold tracking-tight">{channel.name}</h3>
            {channel.members !== undefined && (
              <p className="text-[10px] text-secondary font-medium">{channel.members} members</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
        {loadingMessages ? (
          <SkeletonMessages />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted">
            <p className="text-sm italic">No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.user === 'You'} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  )
}
