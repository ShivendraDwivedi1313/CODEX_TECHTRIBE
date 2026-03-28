export interface Channel {
  id: string
  name: string
  logo?: string
  members?: number
  categoryId: string
}

export interface CreateChannelInput {
  name: string
  logo?: string
}
