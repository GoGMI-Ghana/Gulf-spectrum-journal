'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'

// Shown on an author's public page only when it's genuinely actionable:
// signed in, this author isn't claimed yet, the viewer isn't already
// linked to a (different) author themselves, and they don't already have
// a pending claim sitting somewhere. Everything here is a convenience
// check, not a security boundary — RLS (one_pending_claim_per_user,
// "users claim an author profile") is what actually enforces the rules
// if this component's logic is ever wrong or bypassed.
export default function ClaimAuthorLink({ authorSlug, claimed }: { authorSlug: string; claimed: boolean }) {
  const { user, authLoading } = useAccount()
  const [eligible, setEligible] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user || claimed) return
    let cancelled = false
    const supabase = createClient()

    Promise.all([
      supabase.from('profiles').select('author_id').eq('id', user.id).single(),
      supabase.from('author_claims').select('id').eq('user_id', user.id).eq('status', 'pending').maybeSingle(),
    ]).then(([profileRes, pendingRes]) => {
      if (cancelled) return
      const alreadyLinked = Boolean(profileRes.data?.author_id)
      const hasPending = Boolean(pendingRes.data)
      setEligible(!alreadyLinked && !hasPending)
    })

    return () => {
      cancelled = true
    }
  }, [user, claimed])

  if (claimed || authLoading) return null

  if (!user) {
    return (
      <p className="text-xs text-slate-400 mt-3">
        Is this you?{' '}
        <Link href={`/sign-in?redirect=/authors/${authorSlug}/claim`} className="text-ocean-blue hover:underline">
          Sign in to claim this profile
        </Link>
        .
      </p>
    )
  }

  if (eligible === null) return null
  if (!eligible) return null

  return (
    <p className="text-xs text-slate-400 mt-3">
      Is this you?{' '}
      <Link href={`/authors/${authorSlug}/claim`} className="text-ocean-blue hover:underline">
        Claim this profile
      </Link>
      .
    </p>
  )
}
