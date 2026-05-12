import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/community/:path*',
    '/leaderboard/:path*',
    '/search/:path*',
    '/chat/:path*',
    '/friends/:path*',
    '/questions/:path*',
    '/submissions/:path*',
  ],
}
