// Uploads an image to the journal-images Storage bucket from the browser,
// with the signed-in editor's own session. The bucket's policies
// (editor-only writes, 5 MB, JPEG/PNG/WebP — see the backend's
// journal_images_bucket migration) are the real enforcement; the checks
// here just give a clear message before a doomed upload.
import { createClient } from './supabase/client'

const BUCKET = 'journal-images'
const MAX_BYTES = 5 * 1024 * 1024
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export const JOURNAL_IMAGE_ACCEPT = Object.keys(EXTENSIONS).join(',')

export type JournalImageFolder = 'authors' | 'issues' | 'articles'

export async function uploadJournalImage(
  file: File,
  folder: JournalImageFolder
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const ext = EXTENSIONS[file.type]
  if (!ext) return { url: null, error: 'Use a JPEG, PNG or WebP image.' }
  if (file.size > MAX_BYTES) {
    return { url: null, error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 5 MB.` }
  }

  const supabase = createClient()
  // Random names, never overwritten: a changed image gets a new URL, so
  // browsers and the CDN can cache each one forever.
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' })
  if (error) return { url: null, error: `Upload failed: ${error.message}` }

  return { url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, error: null }
}
