'use client'

import { useState } from 'react'

interface CreateChannelModalProps {
  onClose: () => void
  onCreate: (name: string, logo: string) => void
}

const emojiOptions = ['💬', '🚀', '🔥', '⚡', '🎯', '💡', '🛠️', '🧪', '📦', '🌐', '🎨', '📐']

export default function CreateChannelModal({ onClose, onCreate }: CreateChannelModalProps) {
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💬')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setCreating(true)
    onCreate(trimmed, selectedEmoji)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-white font-semibold text-lg">Create Channel</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Logo picker */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Channel Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center text-2xl">
                {selectedEmoji}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-violet-600/30 border border-violet-500/30 scale-110'
                        : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Channel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. react-hooks-help"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700/40 border border-white/[0.06] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim() || creating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-40 disabled:hover:from-violet-600"
          >
            {creating ? 'Creating...' : 'Create Channel'}
          </button>
        </form>
      </div>
    </div>
  )
}
