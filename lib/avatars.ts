// Members' profile pictures, in the public "avatars" Storage bucket. Each
// member may only write inside a folder named after their own user id (see
// the backend's profile_pictures migration), which is the real protection;
// the checks here just give a clear message first.
import { createClient } from './supabase/client'

const BUCKET = 'avatars'
// Pictures are cropped to a square and scaled to this size before upload:
// enough for the largest place one is shown, and a few dozen kilobytes.
const SIZE = 400
const MAX_INPUT_BYTES = 15 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export const AVATAR_ACCEPT = ACCEPTED.join(',')

export type AvatarError = 'wrongType' | 'tooLarge' | 'unreadable' | 'uploadFailed'

// The centre square of the photo, scaled to SIZE × SIZE, as a JPEG.
async function squareJpeg(file: File): Promise<Blob | null> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return null
  }
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE)
  bitmap.close()
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
}

export async function uploadAvatar(userId: string, file: File): Promise<{ url: string } | { error: AvatarError }> {
  if (!ACCEPTED.includes(file.type)) return { error: 'wrongType' }
  if (file.size > MAX_INPUT_BYTES) return { error: 'tooLarge' }
  const blob = await squareJpeg(file)
  if (!blob) return { error: 'unreadable' }

  const supabase = createClient()
  // A new name each time, never overwritten, so browsers can cache each
  // picture forever and a change shows up straight away.
  const path = `${userId}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
  if (error) {
    console.error('Avatar upload failed', error)
    return { error: 'uploadFailed' }
  }
  return { url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl }
}

// Deletes a picture this member uploaded earlier. Anything that isn't one of
// their files in the avatars bucket is left alone.
export async function deleteAvatarFile(userId: string, url: string | null) {
  if (!url) return
  const marker = `/object/public/${BUCKET}/`
  const at = url.indexOf(marker)
  if (at < 0) return
  const path = decodeURIComponent(url.slice(at + marker.length))
  if (!path.startsWith(`${userId}/`)) return
  const { error } = await createClient().storage.from(BUCKET).remove([path])
  if (error) console.error('Could not delete the old profile picture', error)
}
