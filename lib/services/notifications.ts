import { prisma } from '@/lib/prisma'

type NotificationType =
  | 'FOLLOW_REQUEST'
  | 'FOLLOW_ACCEPTED'
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'MESSAGE_RECEIVED'
  | 'COMMUNITY_JOINED'

export async function createNotification({
  receiverId,
  senderId,
  type,
  message,
}: {
  receiverId: string
  senderId?: string
  type: NotificationType
  message: string
}) {
  if (receiverId === senderId) return null

  return prisma.notification.create({
    data: { receiverId, senderId, type, message },
  })
}
