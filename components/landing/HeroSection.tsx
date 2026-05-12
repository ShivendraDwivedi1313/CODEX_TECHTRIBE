'use client'

import HeroPreviewCards from './HeroPreviewCards'
import FeatureBadge from './FeatureBadge'

export default function HeroSection() {
  return (
    <div className="relative flex flex-col justify-center min-h-[600px] lg:min-h-0 py-20 lg:py-0 px-6 lg:px-12">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] right-0 w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Floating Badges */}
        <div className="flex flex-wrap gap-3 mb-12 animate-in fade-in slide-in-from-left duration-1000">
          <FeatureBadge 
            icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            label="Real-time Stats"
            color="violet"
          />
          <FeatureBadge 
            icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            label="Global Tribes"
            color="cyan"
          />
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-[80px] font-black italic leading-[0.9] tracking-tighter text-white mb-8 animate-in fade-in slide-in-from-left duration-700">
          BUILD YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-500 to-cyan-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            CODING IDENTITY.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl animate-in fade-in slide-in-from-left duration-1000 delay-200">
          The unified platform to track your competitive growth, join specialized communities, and share your path with the developer tribe.
        </p>

        {/* Action Button (Optional secondary) */}
        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          <div className="flex -space-x-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="inline-block w-10 h-10 rounded-full ring-2 ring-slate-950 bg-slate-800" />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-500">
            <span className="text-white">Join 50,000+</span> coders building their legacy today.
          </p>
        </div>
      </div>

      {/* Preview Visualization - only on desktop in this section if you want it here, but it's part of the split screen layout */}
    </div>
  )
}
