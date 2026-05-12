'use client'

import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import ProfileCard from '@/components/profile/ProfileCard'
import PostGrid from '@/components/posts/PostGrid'
import QuestionStatsCard from '@/components/questions/QuestionStatsCard'
import VerificationBadges from '@/components/profile/VerificationBadges'

export default function ProfilePage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postImage, setPostImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPostImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublishPost = async () => {
    if (!postTitle.trim() && !postContent.trim()) {
      alert('Please enter a title or description')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', postTitle)
      formData.append('content', postContent)
      if (postImage) {
        formData.append('image', postImage)
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.status === 200 || response.status === 201) {
        setPostTitle('')
        setPostContent('')
        setPostImage(null)
        setImagePreview(null)
        setShowCreateModal(false)
        // Refresh the posts
        window.location.reload()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Post creation failed:', response.status, errorData)
        alert(errorData.message || 'Failed to publish post')
      }
    } catch (error) {
      console.error('Error publishing post:', error)
      alert('Error publishing post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearImage = () => {
    setPostImage(null)
    setImagePreview(null)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Top – Profile Summary Card */}
          <ProfileCard />

          {/* Coding Progress */}
          <QuestionStatsCard />

          {/* Platform Verification */}
          <VerificationBadges />

          {/* Bottom – Posts Grid */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <PostGrid />
          </div>
        </div>

        {/* Floating Add Post Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 hover:scale-110 hover:shadow-violet-500/50 transition-all duration-300 flex items-center justify-center z-40"
          aria-label="Create Post"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h3 className="text-primary font-bold text-xl">Create Post</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-muted hover:text-primary p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Title</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="What's the title of your post?"
                    className="w-full px-4 py-3 rounded-xl border border-border text-primary placeholder:text-muted focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Description</label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your achievements, learning, or thoughts..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border text-primary placeholder:text-muted focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-skeleton">
                      <Image
                        src={imagePreview}
                        alt="Post preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Image (optional)</label>
                  <label className="flex items-center justify-center w-full px-4 py-8 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-violet-600 hover:bg-violet-50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="text-center">
                      <svg className="w-8 h-8 text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm font-medium text-secondary">Click to upload an image</p>
                      <p className="text-xs text-muted mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-surface border-t border-border px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 rounded-xl text-primary bg-card border border-border font-medium hover:bg-surface transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishPost}
                  disabled={isSubmitting || (!postTitle.trim() && !postContent.trim())}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
