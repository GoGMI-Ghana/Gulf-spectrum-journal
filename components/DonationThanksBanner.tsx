'use client'

import { useSyncExternalStore } from 'react'

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

function getSnapshot() {
  return new URLSearchParams(window.location.search).get('donation') === 'thanks'
}

function getServerSnapshot() {
  return false
}

export default function DonationThanksBanner() {
  const show = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!show) return null

  return (
    <div className="border-l-4 border-gold bg-soft-gold/60 text-royal-blue p-4 my-6">
      <p className="text-sm leading-relaxed">
        Thank you for your donation — we&apos;re confirming the payment now. It&apos;s usually
        instant; your receipt will come from Paystack directly.
      </p>
    </div>
  )
}
