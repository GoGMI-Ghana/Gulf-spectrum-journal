'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useBookmarks } from '@/context/BookmarksContext'

interface ProfileRow {
  full_name: string | null
  role: 'reader' | 'author' | 'editor' | 'admin'
  author_id: string | null
  created_at: string
}

const ROLE_LABELS: Record<ProfileRow['role'], string> = {
  reader: 'Reader',
  author: 'Author',
  editor: 'Editor',
  admin: 'Admin',
}

export default function ProfileForm() {
  const { user, authLoading } = useBookmarks()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [authorSlug, setAuthorSlug] = useState<string | null>(null)
  // Whose profile `profile` holds, compared against the current user below
  // to derive a loading flag — same reasoning as BookmarksContext: every
  // setState here happens inside the fetch's callback, never synchronously
  // at the top of the effect body.
  const [profileForUserId, setProfileForUserId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()

    supabase
      .from('profiles')
      .select('full_name, role, author_id, created_at')
      .eq('id', user.id)
      .single()
      .then(async ({ data, error: profileError }) => {
        if (cancelled) return
        if (profileError || !data) {
          console.error('Failed to load profile', profileError)
          setProfileForUserId(user.id)
          return
        }
        const row = data as ProfileRow
        setProfile(row)
        setFullName(row.full_name ?? '')

        if (row.author_id) {
          const { data: author } = await supabase.from('authors').select('slug').eq('id', row.author_id).maybeSingle()
          if (!cancelled && author) setAuthorSlug(author.slug)
        }
        if (!cancelled) setProfileForUserId(user.id)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const trimmed = fullName.trim()

    // Both writes keep the same name visible everywhere: profiles.full_name
    // is what this page (and RLS) treats as canonical, but the header,
    // dashboard sidebar, and account menu all read the display name off
    // the auth session's user_metadata (set at sign-up, or by Google on
    // first OAuth sign-in) rather than querying profiles on every render.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: trimmed || null })
      .eq('id', user.id)

    if (profileError) {
      setSaving(false)
      setError(profileError.message)
      return
    }

    const { error: authError } = await supabase.auth.updateUser({ data: { full_name: trimmed } })
    setSaving(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setProfile((p) => (p ? { ...p, full_name: trimmed || null } : p))
    setSaved(true)
  }

  const loading = Boolean(user) && profileForUserId !== user?.id

  if (authLoading || loading) {
    return <p className="text-slate-500 text-sm">Loading your profile…</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href="/sign-in?redirect=/profile" className="text-ocean-blue hover:underline">
          Sign in
        </Link>{' '}
        to view your profile.
      </p>
    )
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        {saved && !error && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2">Saved.</p>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setSaved(false)
            }}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <p className="text-sm text-slate-600 border border-slate-200 bg-slate-50 px-3 py-2">{user.email}</p>
          <p className="text-xs text-slate-400 mt-1">Changing your email isn&apos;t available yet.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <div className="border-l-4 border-royal-blue p-5 bg-slate-50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Account type</span>
          <span className="text-sm font-medium text-royal-blue">{profile ? ROLE_LABELS[profile.role] : '—'}</span>
        </div>
        {profile && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Member since</span>
            <span className="text-sm font-medium text-royal-blue">
              {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        )}
        {authorSlug && (
          <div className="pt-2 border-t border-slate-200">
            <Link href={`/authors/${authorSlug}`} className="text-sm text-ocean-blue hover:underline">
              View your author profile and published articles →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
