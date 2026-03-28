export interface ChatMessageType {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'TEXT' | 'CODE'
  language?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  sender?: {
    id: string
    name: string
    profile?: {
      avatarUrl?: string | null
    } | null
  }
}

export interface ConversationType {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
  participants: {
    user: {
      id: string
      name: string
      profile?: {
        avatarUrl?: string | null
      } | null
    }
  }[]
  messages?: ChatMessageType[]
  codeSession?: CodeSessionType | null
}

export interface CodeSessionType {
  id: string
  conversationId: string
  code: string
  language: string
  lastEditedById: string
  updatedAt: Date | string
}

export interface CodeRunResult {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  status: {
    id: number
    description: string
  }
}
