'use client'

import { Message } from '@/types/message'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

function formatTime(timestamp: string) {
  try {
    const d = new Date(timestamp)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function getAvatarColor(name: string) {
  const colors = [
    'from-violet-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-sky-500 to-cyan-500',
    'from-fuchsia-500 to-purple-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(message.user)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}
      >
        {message.user.charAt(0).toUpperCase()}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-xs font-semibold ${isOwn ? 'text-violet-600' : 'text-secondary'}`}>
            {message.user}
          </span>
          <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-violet-600 text-white rounded-tr-md shadow-sm shadow-violet-600/10'
              : 'bg-skeleton text-primary rounded-tl-md'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}
