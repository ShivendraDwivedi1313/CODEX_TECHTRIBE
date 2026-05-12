'use client'

interface HandleInputRowProps {
  platform: 'CODECHEF' | 'CODEFORCES' | 'LEETCODE'
  placeholder: string
  value: string
  loading?: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  message?: string
  // Verification props
  onVerify?: () => void
  isVerifying?: boolean
  isVerified?: boolean
  verifyLink?: string
  verifyTimeLeft?: number
}

export default function HandleInputRow({
  platform,
  placeholder,
  value,
  loading,
  onChange,
  onSubmit,
  message,
  onVerify,
  isVerifying,
  isVerified,
  verifyLink,
  verifyTimeLeft,
}: HandleInputRowProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-muted uppercase tracking-widest min-w-[100px]">
          {platform}
        </label>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all"
          />
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-600/20 active:scale-95 whitespace-nowrap"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Submit'
            )}
          </button>

          {/* Verify Button */}
          {isVerified ? (
            <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold whitespace-nowrap">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          ) : (
            <button
              onClick={onVerify}
              disabled={isVerifying || !value}
              className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                  Verifying
                </div>
              ) : (
                'Verify'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Status message */}
      {message && (
        <p className={`text-xs ml-[112px] ${message.includes('error') || message.includes('Failed') || message.includes('No valid') ? 'text-rose-500' : 'text-emerald-500'}`}>
          {message}
        </p>
      )}

      {/* Verification challenge panel */}
      {isVerifying && verifyLink && (
        <div className="ml-[112px] p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Verification Challenge</p>
            {typeof verifyTimeLeft === 'number' && (
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-border" stroke="currentColor" fill="none" strokeWidth="3" cx="18" cy="18" r="15.5" />
                    <circle
                      className="text-amber-500"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      cx="18" cy="18" r="15.5"
                      strokeDasharray={`${(verifyTimeLeft / 120) * 97.5} 97.5`}
                    />
                  </svg>
                </div>
                <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{formatTime(verifyTimeLeft)}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-secondary">
            Submit a solution to the problem below. The system is watching for your submission.
          </p>
          <a
            href={verifyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open Problem →
          </a>
        </div>
      )}
    </div>
  )
}
