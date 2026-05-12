'use client'

import { useState, useEffect } from 'react'

interface CardActionsProps {
  likes?: number
  postId?: string
}

export default function CardActions({ likes = 0, postId }: CardActionsProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  // Check if native share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const handleLike = () => {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  const shareLink = postId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/posts/${postId}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 pt-4 border-t border-border">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
            liked
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'
              : 'text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              liked ? 'fill-rose-600' : 'fill-none'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* Share */}
        <button 
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:text-sky-600 hover:bg-sky-50 dark:hover:text-sky-400 dark:hover:bg-sky-500/10 transition-all duration-200 group ml-auto"
        >
          <svg
            className="w-4 h-4 fill-none group-hover:scale-110 transition-transform duration-200"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <div 
            className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl dark:shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Share Post</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-secondary mb-4">Copy the link below to share this post:</p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-input-bg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  copied
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button
                onClick={() => {
                  if (canShare && navigator.share) {
                    navigator.share({
                      title: 'Check out this post',
                      url: shareLink,
                    })
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  canShare
                    ? 'bg-surface text-primary hover:bg-border'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!canShare}
              >
                Native Share
              </button>
              <button
                onClick={() => setShareModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-surface text-primary hover:bg-border transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
