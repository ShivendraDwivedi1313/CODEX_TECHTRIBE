'use client'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/[0.05] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black italic text-lg">
                T
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">TechTribe</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
              The premier social platform for developers to connect, track progress, and climb global leaderboards. Join the tribe and accelerate your coding journey.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4">
              <FooterLink>Features</FooterLink>
              <FooterLink>Leaderboard</FooterLink>
              <FooterLink>Communities</FooterLink>
              <FooterLink>API Profile</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink>About Us</FooterLink>
              <FooterLink>Privacy Policy</FooterLink>
              <FooterLink>Terms of Service</FooterLink>
              <FooterLink>Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Social</h4>
            <ul className="space-y-4">
              <FooterLink>Twitter</FooterLink>
              <FooterLink>GitHub</FooterLink>
              <FooterLink>Discord</FooterLink>
              <FooterLink>LinkedIn</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 TechTribe. All rights reserved. Built for the developer community.
          </p>
          <div className="flex gap-8">
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-slate-400">System Status</span>
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-slate-400">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
        {children}
      </button>
    </li>
  )
}
