'use client'

import { useSyncExternalStore } from 'react'
import { useI18n } from '@/context/I18nContext'

// Reads the ?donation=thanks query param via useSyncExternalStore rather
// than the searchParams page prop, the useSearchParams() hook, or an
// effect+setState: the page prop / hook would force this statically-
// generated article page into dynamic (per-request) rendering, and a
// direct setState in an effect is exactly what react-hooks/
// set-state-in-effect flags. useSyncExternalStore is the React-blessed
// way to read a client-only source without a hydration mismatch — same
// reasoning as the original localStorage-backed bookmarks read earlier in
// this project. The query string never changes during this component's
// life, so subscribe is a no-op.
function subscribe() {
  return () => {}
}

// 'thanks' only arrives after /api/donations/verify has confirmed the
// payment with Paystack; 'incomplete' covers a failed check or a donor who
// cancelled on Paystack's page.
function getSnapshot() {
  return new URLSearchParams(window.location.search).get('donation')
}

function getServerSnapshot() {
  return null
}

export default function DonationThanksBanner() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { t } = useI18n()

  if (state === 'thanks') {
    return (
      <div role="status" className="mt-12 border border-emerald-200 bg-emerald-50 text-emerald-900 px-5 py-4">
        <p className="leading-relaxed">{t.support.thanks}</p>
      </div>
    )
  }
  if (state === 'incomplete') {
    return (
      <div role="status" className="mt-12 border border-amber-200 bg-amber-50 text-amber-900 px-5 py-4">
        <p className="leading-relaxed">{t.support.incomplete}</p>
      </div>
    )
  }
  return null
}
