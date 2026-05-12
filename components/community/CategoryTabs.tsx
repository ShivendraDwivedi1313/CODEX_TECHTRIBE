'use client'

import { CommunityCategory } from '@/types/community'

interface CategoryTabsProps {
  categories: CommunityCategory[]
  activeId: string
  onSelect: (id: string) => void
}

function SkeletonTabs() {
  return (
    <div className="flex gap-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-9 w-20 bg-skeleton rounded-full" />
      ))}
    </div>
  )
}

export default function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  if (categories.length === 0) return <SkeletonTabs />

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeId === cat.id
              ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-600/20'
              : 'bg-surface text-secondary border-border hover:bg-border hover:text-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
