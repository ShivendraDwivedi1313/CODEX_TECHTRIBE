'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import CategoryTabs from '@/components/community/CategoryTabs'
import ChannelSidebar from '@/components/community/ChannelSidebar'
import ChatWindow from '@/components/community/ChatWindow'
import SearchChannelModal from '@/components/community/SearchChannelModal'
import CreateChannelModal from '@/components/community/CreateChannelModal'
import { CommunityCategory } from '@/types/community'
import { Channel } from '@/types/channel'

type ModalState = 'none' | 'add-menu' | 'search-channel' | 'create-channel'

export default function CommunityPage() {
  const [categories, setCategories] = useState<CommunityCategory[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannelId, setActiveChannelId] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>('none')
  const [mobileShowChat, setMobileShowChat] = useState(false)

  // Load categories and channels
  useEffect(() => {
    const load = async () => {
      try {
        const catRes = await fetch('/api/communities')
        const catData: CommunityCategory[] = await catRes.json()
        setCategories(catData)
        
        if (catData.length > 0) {
          const firstCatId = catData[0].id
          setActiveCategoryId(firstCatId)
          const chRes = await fetch(`/api/channels?communityId=${firstCatId}`)
          const chData: Channel[] = await chRes.json()
          setChannels(chData)
          if (chData.length > 0) setActiveChannelId(chData[0].id)
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredChannels = channels.filter((c) => c.categoryId === activeCategoryId)
  const activeChannel = channels.find((c) => c.id === activeChannelId) || null

  const handleCategoryChange = async (id: string) => {
    setActiveCategoryId(id)
    setLoading(true)
    try {
      const res = await fetch(`/api/channels?communityId=${id}`)
      const data = await res.json()
      setChannels(data)
      if (data.length > 0) setActiveChannelId(data[0].id)
      else setActiveChannelId('')
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id)
    setMobileShowChat(true)
  }

  const handleAddChannel = async (name: string, logo: string) => {
    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo, categoryId: activeCategoryId }),
      })
      const newChannel: Channel = await res.json()
      setChannels((prev) => [...prev, newChannel])
      setActiveChannelId(newChannel.id)
      setModal('none')
      setMobileShowChat(true)
    } catch {
      // fail silently
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header + Category Tabs */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-5 py-3 flex items-center justify-between gap-4 md:pl-5 pl-16">
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile back button */}
            {mobileShowChat && (
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden text-muted hover:text-primary p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-primary font-bold text-lg">Community</h1>
              <div className="mt-1">
                <CategoryTabs
                  categories={categories}
                  activeId={activeCategoryId}
                  onSelect={handleCategoryChange}
                />
              </div>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold select-none flex-shrink-0">
            T
          </div>
        </header>

        {/* Main Content: channel sidebar + chat */}
        <div className="flex flex-1 min-h-0">
          {/* Channel sidebar */}
          <div
            className={`w-56 shrink-0 border-r border-border bg-surface/50 ${
              mobileShowChat ? 'hidden md:flex flex-col' : 'flex flex-col'
            }`}
          >
            <ChannelSidebar
              channels={filteredChannels}
              activeChannelId={activeChannelId}
              onSelectChannel={handleSelectChannel}
              onAddClick={() => setModal('add-menu')}
              loading={loading}
            />
          </div>

          {/* Chat area */}
          <div
            className={`flex-1 min-w-0 ${
              mobileShowChat ? 'flex flex-col' : 'hidden md:flex md:flex-col'
            }`}
          >
            <ChatWindow channel={activeChannel} loading={loading} />
          </div>
        </div>
      </main>

      {/* Add Community/Channel Menu Modal */}
      {modal === 'add-menu' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal('none')} />
          <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-xs mx-4 p-6 overflow-hidden">
            <h3 className="text-primary font-bold text-lg mb-4 text-center">Add Option</h3>
            <div className="space-y-2">
              <button
                onClick={() => setModal('search-channel')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border text-secondary hover:bg-border hover:text-primary transition-all text-sm font-bold group"
              >
                <span className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
                Search Channel
              </button>
              <button
                onClick={() => setModal('create-channel')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border text-secondary hover:bg-border hover:text-primary transition-all text-sm font-bold group"
              >
                <span className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </span>
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Channel Modal */}
      {modal === 'search-channel' && (
        <SearchChannelModal
          onClose={() => setModal('none')}
          onSelect={(channelId) => {
            setActiveChannelId(channelId)
            setMobileShowChat(true)
          }}
        />
      )}

      {/* Create Channel Modal */}
      {modal === 'create-channel' && (
        <CreateChannelModal
          onClose={() => setModal('none')}
          onCreate={handleAddChannel}
        />
      )}
    </div>
  )
}
