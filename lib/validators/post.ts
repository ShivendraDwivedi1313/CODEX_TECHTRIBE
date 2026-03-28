import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().refine(
    (val) => val === '' || val.startsWith('/uploads/') || /^https?:\/\//.test(val),
    { message: 'Invalid image URL' }
  ).optional().or(z.literal('')),
  projectLink: z.string().url().optional().or(z.literal('')),
  achievement: z.string().optional(),
  communityId: z.string().optional(),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
