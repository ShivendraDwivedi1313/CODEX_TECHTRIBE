'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function LandingNavbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/[0.05] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black italic text-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform">
            T
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">TechTribe</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#community">Community</NavLink>
          <NavLink href="#leaderboard">Leaderboard</NavLink>
          <NavLink href="#about">About</NavLink>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link 
            href={session ? '/dashboard' : '/dashboard'}
            className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            {session ? 'Feed' : 'Explore'}
          </Link>
          <button className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {session ? 'Profile' : 'Join Now'}
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}
