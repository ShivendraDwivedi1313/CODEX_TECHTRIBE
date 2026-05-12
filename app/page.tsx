import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import LandingNavbar from '@/components/landing/LandingNavbar'
import HeroSection from '@/components/landing/HeroSection'
import HeroPreviewCards from '@/components/landing/HeroPreviewCards'
import AuthPanel from '@/components/landing/AuthPanel'
import Footer from '@/components/landing/Footer'

export default async function LandingPage() {
  // Redirect logged-in users to dashboard
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500 selection:text-white">
      <LandingNavbar />
      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen pt-20 lg:pt-0">
          
          {/* Left Hero */}
          <section className="relative h-full flex flex-col justify-center py-20 lg:py-0 border-b lg:border-b-0 lg:border-r border-white/5">
            <HeroSection />
            <div className="hidden lg:block absolute bottom-0 left-0 w-full h-[60%] pointer-events-none opacity-50">
               {/* Visual filler or overflow for hero elements */}
            </div>
          </section>

          {/* Right Content/Auth */}
          <section className="relative flex flex-col justify-center items-center py-20 lg:py-0">
            {/* Visual background for auth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/5 blur-[100px] pointer-events-none" />
            
            <div className="w-full relative z-10">
               <div className="lg:hidden mb-20">
                  <HeroPreviewCards />
               </div>
               <AuthPanel />
            </div>

            {/* Floating preview for desktop - integrated between hero and auth or as background */}
             <div className="hidden lg:block absolute -left-[20%] w-[120%] h-full pointer-events-none z-0 overflow-visible opacity-80">
                <HeroPreviewCards />
             </div>
          </section>
        </div>

        {/* Feature section separator or secondary content can go here */}
      </main>

      <Footer />
    </div>
  )
}
