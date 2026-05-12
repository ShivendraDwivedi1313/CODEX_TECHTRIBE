'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from './providers/ThemeProvider'

const navItems = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: 'Search',
    href: '/search',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'Questions',
    href: '/questions',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'Community',
    href: '/community',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    label: 'Friends',
    href: '/friends',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [unreadCount, setUnreadCount] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          const unread = data.filter((n: any) => !n.isRead).length
          setUnreadCount(unread)
        }
      } catch (e) {}
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  /* ── Mobile full sidebar content ── */
  const mobileSidebarContent = (
    <div className="flex flex-col h-full py-6 px-3">
      <Link href="/dashboard" className="flex items-center gap-3 px-3 mb-8 group">
        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-violet-600/20">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-primary font-bold text-lg tracking-tight">TechTribe</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full group ${
              isActive(item.href)
                ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 border border-violet-100 dark:border-violet-500/20'
                : 'text-secondary hover:text-primary hover:bg-surface border border-transparent'
            }`}
          >
            <span className={`transition-colors duration-200 ${isActive(item.href) ? 'text-violet-600' : 'text-muted group-hover:text-secondary'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-1 pt-4 border-t border-border">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            isActive('/settings')
              ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600'
              : 'text-secondary hover:text-primary hover:bg-surface'
          }`}
        >
          <span className={`${isActive('/settings') ? 'text-violet-600' : 'text-muted group-hover:text-secondary'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Settings
        </Link>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-surface transition-all duration-200 group"
        >
          <span className="text-muted group-hover:text-secondary">
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </span>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 group"
        >
          <span className="text-muted group-hover:text-rose-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </span>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card/80 backdrop-blur border border-border text-secondary hover:text-primary shadow-lg shadow-black/5"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {mobileSidebarContent}
      </aside>

      {/* ── Desktop sidebar: Instagram-style icon rail ── */}
      <aside
        className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen bg-card border-r border-border overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: expanded ? 220 : 68 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex flex-col h-full py-5">
          {/* Brand / Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 px-[18px] mb-6 group h-10">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-violet-600/20">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5" />
              </svg>
            </div>
            <span
              className={`text-primary font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300 ${
                expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
            >
              TechTribe
            </span>
          </Link>

          {/* Nav items */}
          <nav className="flex flex-col gap-0.5 flex-1 px-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex items-center gap-3 pl-[10px] py-3 rounded-xl font-medium transition-all duration-200 group ${
                    active
                      ? 'text-primary'
                      : 'text-secondary hover:text-primary hover:bg-surface'
                  }`}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-600 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <span className={`flex-shrink-0 transition-all duration-200 ${
                    active
                      ? 'text-primary scale-110'
                      : 'text-muted group-hover:text-primary group-hover:scale-105'
                  }`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-sm whitespace-nowrap transition-all duration-300 ${
                      expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Notification badge */}
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className={`bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-sm transition-all duration-300 ${
                      expanded
                        ? 'ml-auto px-1.5'
                        : 'absolute -top-0.5 -right-0.5 px-1'
                    }`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom actions */}
          <div className="flex flex-col gap-0.5 pt-3 mt-auto border-t border-border mx-2 px-0">
            {/* Settings */}
            <Link
              href="/settings"
              className={`flex items-center gap-3 pl-[10px] py-3 rounded-xl transition-all duration-200 group ${
                isActive('/settings')
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary hover:bg-surface'
              }`}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'
              }`}>
                Settings
              </span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 pl-[10px] py-3 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all duration-200 group"
            >
              <span className="flex-shrink-0 text-muted group-hover:text-primary transition-colors">
                {theme === 'light' ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                )}
              </span>
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'
              }`}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 pl-[10px] py-3 rounded-xl text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 group"
            >
              <span className="flex-shrink-0 text-muted group-hover:text-rose-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </span>
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none w-0'
              }`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
