'use client'

import { useState } from 'react'

interface CreateCommunityModalProps {
  onClose: () => void
  onCreate: (name: string, description: string) => void
}

export default function CreateCommunityModal({ onClose, onCreate }: CreateCommunityModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    onCreate(name.trim(), description.trim())
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-primary">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-surface/30 font-bold">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-primary text-xl font-bold">Create Community</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-border transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-secondary text-sm mt-1 font-medium">Start a new community for your field</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-primary mb-1.5">Community Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || creating}
            className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {creating ? 'Creating...' : 'Create Community'}
          </button>
        </form>
      </div>
    </div>
  )
}
