import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * Validate and save an uploaded file to the local filesystem (public/uploads/).
 * Returns the public URL path, e.g. "/uploads/1711100000000-a1b2c3d4.png"
 *
 * NOTE: For production, replace this with cloud storage (S3, Cloudflare R2, Vercel Blob).
 * Local filesystem uploads are ephemeral on serverless platforms.
 */
export async function saveUploadedFile(file: File): Promise<string> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: JPG, PNG, GIF, WebP.`)
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
  }

  // Validate file size is not zero
  if (file.size === 0) {
    throw new Error('File is empty.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Generate a unique filename
  const ext = path.extname(file.name) || '.png'
  const safeName = ext.replace(/[^.a-zA-Z0-9]/g, '') // sanitize extension
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeName}`

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const filePath = path.join(uploadsDir, uniqueName)
  await writeFile(filePath, buffer)

  return `/uploads/${uniqueName}`
}
