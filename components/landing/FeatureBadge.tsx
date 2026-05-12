'use client'

interface FeatureBadgeProps {
  icon: React.ReactNode
  label: string
  className?: string
  color: 'violet' | 'emerald' | 'amber' | 'cyan'
}

export default function FeatureBadge({ icon, label, className = '', color }: FeatureBadgeProps) {
  const colors = {
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-md animate-float ${colors[color]} ${className}`}>
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.1em]">{label}</span>
    </div>
  )
}
