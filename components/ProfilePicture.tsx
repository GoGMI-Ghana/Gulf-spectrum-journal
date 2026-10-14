'use client'

import { useRef, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { AVATAR_ACCEPT, deleteAvatarFile, uploadAvatar } from '@/lib/avatars'
import AuthorAvatar from './AuthorAvatar'

// The picture section of the Profile page. Saves the picture to the
// member's profile and, when their account is linked to an author profile,
// to that author too, so it appears on their articles.
export default function ProfilePicture({ linkedToAuthor }: { linkedToAuthor: boolean }) {
  const { user, avatarUrl, setAvatarUrl } = useAccount()
  const { t } = useI18n()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null
  const userId = user.id
  const name = user.fullName || user.email

  async function save(url: string | null) {
    const supabase = createClient()
    const { error: profileError } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)
    if (profileError) {
      console.error('Could not save the profile picture', profileError)
      return false
    }
    if (linkedToAuthor) {
      const { error: authorError } = await supabase.from('authors').update({ photo_url: url }).eq('user_id', userId)
      if (authorError) console.error('Could not update the author photo', authorError)
    }
    return true
  }

  async function handleFile(file: File | undefined) {
    if (input.current) input.current.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    const result = await uploadAvatar(userId, file)
    if ('error' in result) {
      setBusy(false)
      setError(t.profile.pictureErrors[result.error])
      return
    }
    const previous = avatarUrl
    if (await save(result.url)) {
      setAvatarUrl(result.url)
      await deleteAvatarFile(userId, previous)
    } else {
      await deleteAvatarFile(userId, result.url)
      setError(t.profile.pictureErrors.uploadFailed)
    }
    setBusy(false)
  }

  async function handleRemove() {
    setBusy(true)
    setError(null)
    const previous = avatarUrl
    if (await save(null)) {
      setAvatarUrl(null)
      await deleteAvatarFile(userId, previous)
    } else {
      setError(t.profile.pictureErrors.uploadFailed)
    }
    setBusy(false)
  }

  return (
    <div className="flex items-center gap-5 mb-8">
      <AuthorAvatar name={name} photo={avatarUrl} size="lg" className="rounded-full" />
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1">{t.profile.pictureHeading}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-royal-blue text-sm text-royal-blue px-3 py-1.5 transition-colors disabled:opacity-60"
          >
            <Camera size={15} />
            {busy ? t.profile.pictureUploading : avatarUrl ? t.profile.pictureChange : t.profile.pictureUpload}
          </button>
          {avatarUrl && !busy && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={15} />
              {t.profile.pictureRemove}
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={AVATAR_ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="text-xs text-slate-400 mt-1.5">
          {t.profile.pictureHint}
          {linkedToAuthor ? ` ${t.profile.pictureAuthorNote}` : ''}
        </p>
        {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
      </div>
    </div>
  )
}
