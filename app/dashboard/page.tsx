import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Feed */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Feed />
        </div>
      </main>
    </div>
  )
}
