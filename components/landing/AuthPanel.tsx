'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function AuthPanel() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      // Auto-login after signup
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError('Account created! Please sign in.')
        setIsLogin(true)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        throw new Error('Invalid email or password')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      handleLogin()
    } else {
      handleSignup()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-0">
      <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl animate-in zoom-in duration-700">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic tracking-tight text-white mb-2">
            {isLogin ? 'WELCOME BACK.' : 'JOIN THE TRIBE.'}
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            {isLogin ? 'Enter your credentials to continue' : 'Create your coding identity today'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-medium"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email</label>
            <input 
              name="email"
              type="email" 
              placeholder="ishant@techtribe.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              {isLogin && <button type="button" className="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors">Forgot?</button>}
            </div>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="group-hover:tracking-[0.3em] transition-all duration-300">
              {isLoading ? 'PROCESSING...' : (isLogin ? 'Log In to Profile' : 'Construct Account')}
            </span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[#0f172a] px-4 text-slate-600">Secure Access</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => signIn('github')} className="flex items-center justify-center py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">GitHub</span>
            </button>
            <button type="button" onClick={() => signIn('google')} className="flex items-center justify-center py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Google</span>
            </button>
          </div>
        </form>

        {/* Toggle */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {isLogin ? "Don't have an identity yet?" : "Already part of the tribe?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-white hover:text-violet-400 underline decoration-violet-500/50 underline-offset-4 transition-colors"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] leading-loose">
        By continuing, you agree to the TechTribe <br />
        <span className="text-slate-500 cursor-pointer">Terms of Service</span> & <span className="text-slate-500 cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  )
}
