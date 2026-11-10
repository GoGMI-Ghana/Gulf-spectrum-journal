'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'
import SideSection from './SideSection'

const BUTTON =
  'inline-flex items-center justify-center border border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white font-semibold px-4 py-2.5 transition-colors'

// The side-column box on an author's public page. Two cases:
// - the signed-in member IS this author: a way to edit their profile
//   (photo, affiliation, biography live on /profile);
// - the profile isn't claimed yet and the viewer could claim it: what
//   claiming is for, and the link to do it.
// Otherwise it renders nothing. Everything here is a convenience check,
// not a security boundary: RLS (one_pending_claim_per_user, "users claim
// an author profile", "claimed authors edit their own record") enforces
// the real rules if this logic is ever wrong or bypassed.
export default function ClaimAuthorLink({
  authorSlug,
  authorName,
  claimed,
}: {
  authorSlug: string
  authorName: string
  claimed: boolean
}) {
  const { user, authLoading } = useAccount()
  const { t } = useI18n()
  const [state, setState] = useState<{ forUser: string; owner: boolean; canClaim: boolean } | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()

    Promise.all([
      supabase.from('authors').select('id').eq('slug', authorSlug).eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('author_id').eq('id', user.id).single(),
      supabase.from('author_claims').select('id').eq('user_id', user.id).eq('status', 'pending').maybeSingle(),
    ]).then(([ownRes, profileRes, pendingRes]) => {
      if (cancelled) return
      const owner = Boolean(ownRes.data)
      const alreadyLinked = Boolean(profileRes.data?.author_id)
      const hasPending = Boolean(pendingRes.data)
      setState({ forUser: user.id, owner, canClaim: !claimed && !alreadyLinked && !hasPending })
    })

    return () => {
      cancelled = true
    }
  }, [user, authorSlug, claimed])

  if (authLoading) return null

  if (!user) {
    if (claimed) return null
    return (
      <SideSection title={fmt(t.author.claimHeading, { name: authorName })}>
        <p className="text-slate-700 leading-relaxed mb-4">{t.author.claimBody}</p>
        <Link href={`/sign-in?redirect=/authors/${authorSlug}/claim`} className={BUTTON}>
          {t.author.signInToClaim}
        </Link>
      </SideSection>
    )
  }

  if (!state || state.forUser !== user.id) return null

  if (state.owner) {
    return (
      <SideSection title={t.author.ownHeading}>
        <p className="text-slate-700 leading-relaxed mb-4">{t.author.ownBody}</p>
        <Link href="/profile" className={BUTTON}>
          {t.author.editProfile}
        </Link>
      </SideSection>
    )
  }

  if (!state.canClaim) return null

  return (
    <SideSection title={fmt(t.author.claimHeading, { name: authorName })}>
      <p className="text-slate-700 leading-relaxed mb-4">{t.author.claimBody}</p>
      <Link href={`/authors/${authorSlug}/claim`} className={BUTTON}>
        {t.author.claimProfile}
      </Link>
    </SideSection>
  )
}
