import { z } from 'zod'

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  college: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
})

export const codingHandleSchema = z.object({
  platform: z.enum(['CODEFORCES', 'CODECHEF', 'LEETCODE']),
  handle: z.string().min(1, 'Handle is required'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CodingHandleInput = z.infer<typeof codingHandleSchema>
