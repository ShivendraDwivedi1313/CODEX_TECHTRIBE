'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search for users...' }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-muted group-focus-within:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-card border border-border text-primary text-lg placeholder:text-muted focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-lg shadow-black/5"
      />
    </div>
  )
}
