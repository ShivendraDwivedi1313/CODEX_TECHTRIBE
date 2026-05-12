'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useTheme } from '@/components/providers/ThemeProvider'
import { signOut } from 'next-auth/react'

type Tab = 'account' | 'privacy' | 'preferences'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account')
  const { theme, toggleTheme } = useTheme()

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [savingPw, setSavingPw] = useState(false)

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleChangePassword = async () => {
    setPasswordMsg('')
    setPasswordErr('')
    if (newPassword.length < 6) { setPasswordErr('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordErr('Passwords do not match.'); return }
    setSavingPw(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setPasswordErr(data.error || 'Failed to update password.'); return }
      setPasswordMsg(data.message || 'Password updated!')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch { setPasswordErr('Network error.') }
    finally { setSavingPw(false) }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      const res = await fetch('/api/settings/account', { method: 'DELETE' })
      if (res.ok) {
        await signOut({ callbackUrl: '/' })
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete account.')
      }
    } catch { alert('Network error.') }
    finally { setDeleting(false) }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'account', label: 'Account',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    },
    {
      id: 'privacy', label: 'Privacy',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    },
    {
      id: 'preferences', label: 'Preferences',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-surface">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Header */}
          <h1 className="text-2xl font-bold text-primary mb-1">Settings</h1>
          <p className="text-secondary text-sm mb-8">Manage your account, privacy, and preferences.</p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-card border border-border rounded-xl mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'text-secondary hover:text-primary hover:bg-surface'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── ACCOUNT TAB ── */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Change Password</h2>
                <p className="text-sm text-secondary mb-5">Update your password or set one if you signed up via Google/GitHub.</p>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Leave blank if OAuth user" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                  </div>
                  {passwordErr && <p className="text-xs text-rose-500 font-medium">{passwordErr}</p>}
                  {passwordMsg && <p className="text-xs text-emerald-500 font-medium">{passwordMsg}</p>}
                  <button onClick={handleChangePassword} disabled={savingPw || !newPassword} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-600/20">
                    {savingPw ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-card border border-rose-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  <h2 className="text-lg font-bold text-rose-500">Danger Zone</h2>
                </div>
                <p className="text-sm text-secondary mb-5">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-sm font-semibold border border-rose-500/20 hover:bg-rose-500/20 transition-all">
                  Delete My Account
                </button>
              </div>
            </div>
          )}

          {/* ── PRIVACY TAB ── */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Profile Visibility</h2>
                <p className="text-sm text-secondary mb-5">Control who can see your profile and stats.</p>
                <div className="space-y-4">
                  <ToggleRow label="Public Profile" description="Anyone can view your profile and coding stats." defaultChecked={true} />
                  <ToggleRow label="Show on Leaderboard" description="Display your TechTribe score on the global leaderboard." defaultChecked={true} />
                  <ToggleRow label="Show Activity Status" description="Let others see when you are online." defaultChecked={true} />
                </div>
              </div>
            </div>
          )}

          {/* ── PREFERENCES TAB ── */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Appearance</h2>
                <p className="text-sm text-secondary mb-5">Choose how TechTribe looks for you.</p>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button onClick={() => { if (theme === 'dark') toggleTheme() }} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/30'}`}>
                    <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                    <span className="text-sm font-medium text-primary">Light</span>
                  </button>
                  <button onClick={() => { if (theme === 'light') toggleTheme() }} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/30'}`}>
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                    <span className="text-sm font-medium text-primary">Dark</span>
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Notifications</h2>
                <p className="text-sm text-secondary mb-5">Choose what notifications you receive.</p>
                <div className="space-y-4">
                  <ToggleRow label="Friend Requests" description="Notify when someone sends you a friend request." defaultChecked={true} />
                  <ToggleRow label="Post Likes & Comments" description="Notify when someone likes or comments on your post." defaultChecked={true} />
                  <ToggleRow label="Community Messages" description="Notify for new messages in your communities." defaultChecked={false} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">Delete Account</h3>
                  <p className="text-xs text-secondary">This action is permanent and irreversible.</p>
                </div>
              </div>
              <p className="text-sm text-secondary mb-4">All your posts, stats, friends, messages, and profile data will be permanently erased. Type <strong className="text-rose-500">DELETE</strong> below to confirm.</p>
              <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder='Type "DELETE" to confirm' className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 transition-all mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm font-medium hover:bg-border transition-all">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE' || deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-40 transition-all">
                  {deleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ── Reusable Toggle Row ── */
function ToggleRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <button onClick={() => setEnabled(!enabled)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-violet-600' : 'bg-border'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}
