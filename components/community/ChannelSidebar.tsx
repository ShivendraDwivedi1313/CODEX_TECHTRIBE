'use client'

import { Channel } from '@/types/channel'
import ChannelItem from './ChannelItem'

interface ChannelSidebarProps {
  channels: Channel[]
  activeChannelId: string
  onSelectChannel: (id: string) => void
  onAddClick: () => void
  loading: boolean
}

function SkeletonChannels() {
  return (
    <div className="flex flex-col gap-1.5 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-lg bg-skeleton" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-skeleton rounded w-24" />
            <div className="h-2.5 bg-surface rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ChannelSidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onAddClick,
  loading,
}: ChannelSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-border">
        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">Channels</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-hide">
        {loading ? (
          <SkeletonChannels />
        ) : channels.length === 0 ? (
          <p className="text-xs text-muted px-3 py-4 text-center italic">No channels yet</p>
        ) : (
          channels.map((ch) => (
            <ChannelItem
              key={ch.id}
              channel={ch}
              isActive={ch.id === activeChannelId}
              onClick={() => onSelectChannel(ch.id)}
            />
          ))
        )}
      </div>

      {/* Add channel button */}
      <div className="px-3 py-3 border-t border-border bg-card">
        <button
          onClick={onAddClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 text-sm font-medium hover:bg-violet-100 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Channel
        </button>
      </div>
    </div>
  )
}
