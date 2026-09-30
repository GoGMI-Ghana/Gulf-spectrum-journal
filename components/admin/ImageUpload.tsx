'use client'

// Image field for the admin panel: upload a file to the journal-images
// Storage bucket, or paste a URL. Uploads go straight from the browser
// with the editor's own session; the bucket's policies (editor-only
// writes, 5 MB, JPEG/PNG/WebP — see the backend's
// journal_images_bucket migration) are the real enforcement. The checks
// here just give a clear message before a doomed upload.
//
// Stores the file's public URL in the form field, so the rest of the app
// is unchanged — photo_url / cover_image still hold a plain URL either
// way. Replacing or removing an image doesn't delete the old file (the
// form might still be cancelled); orphans are harmless and small.

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { inputClass } from './AdminUI'

const BUCKET = 'journal-images'
const MAX_BYTES = 5 * 1024 * 1024
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export default function ImageUpload({
  value,
  onChange,
  folder,
  previewClassName = 'w-20 h-20',
}: {
  value: string
  onChange: (url: string) => void
  folder: 'authors' | 'issues'
  previewClassName?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    const ext = EXTENSIONS[file.type]
    if (!ext) {
      setError('Use a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 5 MB.`)
      return
    }

    setUploading(true)
    const supabase = createClient()
    // Random names, never overwritten: a changed image gets a new URL,
    // so browsers and the CDN can cache each one forever.
    const path = `${folder}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: '31536000' })
    setUploading(false)

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      return
    }
    onChange(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {value ? (
          // Plain <img>: the value can be any URL an editor pasted.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={`${previewClassName} object-cover border border-slate-200 shrink-0`} />
        ) : (
          <div className={`${previewClassName} border border-dashed border-slate-300 bg-slate-50 shrink-0`} />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-royal-blue text-slate-700 text-sm font-medium px-3 py-1.5 transition-colors disabled:opacity-60"
          >
            <Upload size={14} />
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600"
            >
              <X size={14} /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            // Reset so choosing the same file again still fires onChange.
            e.target.value = ''
            if (file) handleFile(file)
          }}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <input
        className={inputClass}
        value={value}
        placeholder="…or paste an image URL"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
