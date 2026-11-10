'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/context/I18nContext'

const FIELD =
  'w-full border border-slate-300 px-3 py-2 text-[0.9375rem] focus:outline-2 focus:-outline-offset-1 focus:outline-royal-blue focus:border-royal-blue'

// Asks the server to refresh the public pages after a member edits their
// own author record. Never throws: the save already succeeded, and a
// failed refresh only means the change appears at the next hourly
// regeneration instead of right away.
export async function refreshAuthorPages() {
  try {
    await fetch('/api/account/author-updated', { method: 'POST' })
  } catch (err) {
    console.error('Failed to refresh author pages', err)
  }
}

// The "Your author profile" part of the Profile page, shown only to a
// member whose account is linked to an author record. RLS ("claimed
// authors edit their own record") is what allows and limits the write.
export default function AuthorDetailsForm({ userId }: { userId: string }) {
  const { t } = useI18n()
  const [loaded, setLoaded] = useState(false)
  const [affiliation, setAffiliation] = useState('')
  const [credentials, setCredentials] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    createClient()
      .from('authors')
      .select('affiliation, credentials, bio')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setAffiliation(data?.affiliation ?? '')
        setCredentials(data?.credentials ?? '')
        setBio(data?.bio ?? '')
        setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    const { error: saveError } = await createClient()
      .from('authors')
      .update({
        affiliation: affiliation.trim() || null,
        credentials: credentials.trim() || null,
        bio: bio.trim() || null,
      })
      .eq('user_id', userId)
    if (saveError) {
      setSaving(false)
      setError(t.profile.pictureErrors.uploadFailed)
      return
    }
    await refreshAuthorPages()
    setSaving(false)
    setSaved(true)
  }

  if (!loaded) return null

  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setSaved(false)
  }

  return (
    <section aria-labelledby="author-profile-heading" className="border-t border-slate-200 pt-8 mt-10">
      <h2 id="author-profile-heading" className="font-display text-2xl text-royal-blue">
        {t.profile.authorHeading}
      </h2>
      <p className="text-slate-600 mt-1 mb-6">{t.profile.authorIntro}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="author-affiliation" className="block text-sm font-medium text-slate-700 mb-1">
            {t.profile.affiliationLabel}
          </label>
          <input
            id="author-affiliation"
            type="text"
            value={affiliation}
            onChange={(e) => edit(setAffiliation)(e.target.value)}
            aria-describedby="author-affiliation-hint"
            className={FIELD}
          />
          <p id="author-affiliation-hint" className="text-sm text-slate-600 mt-1">
            {t.profile.affiliationHint}
          </p>
        </div>

        <div>
          <label htmlFor="author-credentials" className="block text-sm font-medium text-slate-700 mb-1">
            {t.profile.credentialsLabel}
          </label>
          <input
            id="author-credentials"
            type="text"
            value={credentials}
            onChange={(e) => edit(setCredentials)(e.target.value)}
            aria-describedby="author-credentials-hint"
            className={`${FIELD} max-w-xs`}
          />
          <p id="author-credentials-hint" className="text-sm text-slate-600 mt-1">
            {t.profile.credentialsHint}
          </p>
        </div>

        <div>
          <label htmlFor="author-bio" className="block text-sm font-medium text-slate-700 mb-1">
            {t.profile.bioLabel}
          </label>
          <textarea
            id="author-bio"
            rows={6}
            value={bio}
            onChange={(e) => edit(setBio)(e.target.value)}
            aria-describedby="author-bio-hint"
            className={`${FIELD} leading-relaxed`}
          />
          <p id="author-bio-hint" className="text-sm text-slate-600 mt-1">
            {t.profile.bioHint}
          </p>
        </div>

        <div role="status" aria-live="polite">
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
          {saved && !error && (
            <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2">
              {t.profile.authorSaved}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-3 transition-colors disabled:opacity-60"
        >
          {saving ? t.common.saving : t.profile.authorSave}
        </button>
      </form>
    </section>
  )
}
