import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/NextAuthProvider'
import ThemeProvider from '@/components/providers/ThemeProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TechTribe — Dashboard',
  description: 'A modern developer community dashboard with social feed and navigation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Anti-flash script: apply dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-surface antialiased transition-colors duration-300">
        <NextAuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
