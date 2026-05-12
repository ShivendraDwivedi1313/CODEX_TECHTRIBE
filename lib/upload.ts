import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

/**
 * Save an uploaded file to the local filesystem (public/uploads/).
 * Returns the public URL path, e.g. "/uploads/1711100000000-a1b2c3d4.png"
 */
export async function saveUploadedFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  // Generate a unique filename
  const ext = path.extname(file.name) || '.png'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const filePath = path.join(uploadsDir, uniqueName)
  await writeFile(filePath, buffer)

  return `/uploads/${uniqueName}`
}
