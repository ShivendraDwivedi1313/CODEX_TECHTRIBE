import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, profile }) {
      // Handle OAuth user creation/update
      if (profile && user.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        })

        if (!dbUser) {
          // Create new user from OAuth
          dbUser = await prisma.user.create({
            data: {
              name: user.name || profile.name || 'User',
              email: user.email,
              password: '', // OAuth users don't have passwords
              profile: {
                create: {
                  bio: '',
                  avatarUrl: user.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
                },
              },
            },
            select: { id: true },
          })
        }

        // Update the user object with the database ID
        user.id = dbUser.id
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
