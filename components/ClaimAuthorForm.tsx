'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'

type Eligibility = 'checking' | 'eligible' | 'already-linked' | 'pending' | 'claimed'

export default function ClaimAuthorForm({
  authorId,
  authorSlug,
  authorName,
  claimed,
}: {
  authorId: string
  authorSlug: string
  authorName: string
  claimed: boolean
}) {
  const { user, authLoading } = useAccount()
  const [eligibility, setEligibility] = useState<Eligibility>(claimed ? 'claimed' : 'checking')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || claimed) return
    let cancelled = false
    const supabase = createClient()

    Promise.all([
      supabase.from('profiles').select('author_id').eq('id', user.id).single(),
      supabase.from('author_claims').select('id').eq('user_id', user.id).eq('status', 'pending').maybeSingle(),
    ]).then(([profileRes, pendingRes]) => {
      if (cancelled) return
      if (profileRes.data?.author_id) setEligibility('already-linked')
      else if (pendingRes.data) setEligibility('pending')
      else setEligibility('eligible')
    })

    return () => {
      cancelled = true
    }
  }, [user, claimed])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('author_claims')
      .insert({ user_id: user.id, author_id: authorId, message: message.trim() || null })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSubmitted(true)
  }

  if (authLoading) {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href={`/sign-in?redirect=/authors/${authorSlug}/claim`} className="text-ocean-blue hover:underline">
          Sign in
        </Link>{' '}
        to claim this profile.
      </p>
    )
  }

  // Only reachable once we know there's a signed-in user to check
  // eligibility for — the effect above never resolves it otherwise.
  if (eligibility === 'checking') {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  if (eligibility === 'claimed') {
    return <p className="text-slate-600 bg-slate-100 border-l-4 border-slate-300 p-4">This profile is already linked to an account.</p>
  }

  if (eligibility === 'already-linked') {
    return (
      <p className="text-slate-600 bg-slate-100 border-l-4 border-slate-300 p-4">
        Your account is already linked to a different author profile. Contact the editorial office if that&apos;s a
        mistake.
      </p>
    )
  }

  if (eligibility === 'pending' || submitted) {
    return (
      <p className="text-slate-600 bg-amber-50 border-l-4 border-amber-300 p-4">
        Your claim on <strong>{authorName}</strong> is in with the editorial team for review. You&apos;ll see the
        profile linked to your account once it&apos;s approved.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
      <p className="text-slate-600 text-sm">
        Claiming <strong>{authorName}</strong> links this author profile to your account, so you can keep the bio,
        photo, and credentials up to date yourself.
      </p>
      <div>
        <label htmlFor="claim-message" className="block text-sm font-medium text-slate-700 mb-1">
          Anything that helps confirm this is you (optional)
        </label>
        <textarea
          id="claim-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. your institutional email, a link to your work, or how the editorial office can verify this."
          className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Claim'}
      </button>
    </form>
  )
}
