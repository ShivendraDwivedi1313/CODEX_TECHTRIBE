'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      })
      fetchNotifications()
    } catch (error) {}
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
      fetchNotifications()
    } catch (error) {}
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-pulse">
        <div className="h-8 w-48 bg-skeleton rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-skeleton rounded-2xl w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="text-secondary text-sm">Stay updated with your connections</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-violet-600 text-sm font-semibold hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-secondary">No notifications yet.</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => {
                if (!notification.isRead) markAsRead(notification.id)
              }}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                notification.isRead 
                  ? 'bg-card border-border hover:bg-surface' 
                  : 'bg-violet-50/50 border-violet-100 hover:bg-violet-50 dark:bg-violet-500/5 dark:border-violet-500/20'
              }`}
            >
              <Link href={notification.sender ? `/user/${notification.sender.id}` : '#'} className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border hover:ring-violet-300 transition-all">
                  <Image 
                    src={notification.sender?.profile?.avatarUrl || 'https://via.placeholder.com/48?text=U'} 
                    alt={notification.sender?.name || 'User'}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>
              <div className="flex-1">
                <p className="text-sm text-primary">
                  {notification.sender && (
                    <Link href={`/user/${notification.sender.id}`} className="font-bold hover:underline">
                      {notification.sender.name}
                    </Link>
                  )}
                  {' '}
                  <span className="text-secondary">{notification.message}</span>
                </p>
                <div className="text-xs text-muted mt-1 font-medium">
                  {new Date(notification.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                  })}
                </div>
              </div>
              {!notification.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(124,58,237,0.5)]"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
