'use client'

export default function HeroPreviewCards() {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* 1. Profile Preview Card */}
      <div className="absolute top-[10%] -left-[5%] w-64 p-5 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl animate-float -rotate-3 hover:rotate-0 transition-all duration-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-white/10 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white font-black italic text-xl">I</div>
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight">Ishant_07</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specialist @ CF</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Solved</p>
            <p className="text-lg font-black text-white leading-none">487</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Rank</p>
            <p className="text-lg font-black text-emerald-400 leading-none">#1.2k</p>
          </div>
        </div>
      </div>

      {/* 2. Leaderboard Preview Card */}
      <div className="absolute bottom-[10%] right-[0%] w-72 p-6 rounded-[32px] bg-slate-900/60 backdrop-blur-3xl border border-white/5 shadow-2xl animate-float-delayed rotate-2 hover:rotate-0 transition-all duration-700 z-20">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Weekly Leaderboard</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-amber-400">01</span>
              <div className="w-6 h-6 rounded-full bg-slate-700" />
              <span className="text-xs font-black">Alex_Dev</span>
            </div>
            <span className="text-[10px] font-black text-slate-400">8.4k</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400">02</span>
              <div className="w-6 h-6 rounded-full bg-slate-700" />
              <span className="text-xs font-black">CodeWiz</span>
            </div>
            <span className="text-[10px] font-black text-slate-400">7.9k</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-violet-500/20 border border-violet-500/20">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white">03</span>
              <div className="w-6 h-6 rounded-full bg-violet-600" />
              <span className="text-xs font-black text-white underline decoration-violet-400">You</span>
            </div>
            <span className="text-[10px] font-black text-white">7.5k</span>
          </div>
        </div>
      </div>

      {/* 3. Community Stats Preview */}
      <div className="absolute top-[40%] right-[10%] p-4 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-xl animate-float z-10 rotate-6 group">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Communities</span>
        </div>
        <p className="text-2xl font-black italic tracking-tighter text-white group-hover:text-emerald-400 transition-colors">1.2k+</p>
        <p className="text-[9px] font-bold text-slate-500 uppercase">Developers Coding Now</p>
      </div>

      {/* 4. Chart Preview */}
      <div className="absolute bottom-[25%] -left-[10%] p-6 rounded-[24px] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl animate-float-delayed -rotate-6 z-0">
        <div className="flex gap-2 items-end h-20">
          <div className="w-4 bg-violet-500/20 h-[30%] rounded-t-lg transition-all hover:h-[40%]" />
          <div className="w-4 bg-violet-500/40 h-[60%] rounded-t-lg transition-all hover:h-[70%]" />
          <div className="w-4 bg-violet-500/60 h-[45%] rounded-t-lg transition-all hover:h-[55%]" />
          <div className="w-4 bg-violet-600 h-[90%] rounded-t-lg transition-all hover:h-[100%]" />
          <div className="w-4 bg-indigo-500 h-[70%] rounded-t-lg transition-all hover:h-[80%]" />
        </div>
        <p className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Growth Velocity</p>
      </div>
    </div>
  )
}
