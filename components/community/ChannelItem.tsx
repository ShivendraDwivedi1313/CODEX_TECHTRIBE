'use client'

import { Channel } from '@/types/channel'

interface ChannelItemProps {
  channel: Channel
  isActive: boolean
  onClick: () => void
}

export default function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
        isActive
          ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 border border-violet-100 dark:border-violet-500/20'
          : 'text-secondary hover:text-primary hover:bg-surface border border-transparent'
      }`}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-skeleton text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
        {channel.logo || '💬'}
      </span>
      <div className="flex flex-col items-start min-w-0">
        <span className="truncate w-full text-left">{channel.name}</span>
        {channel.members !== undefined && (
          <span className="text-[10px] text-muted">{channel.members} members</span>
        )}
      </div>
    </button>
  )
}
