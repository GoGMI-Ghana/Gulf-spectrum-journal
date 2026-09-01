'use client'

import { useState } from 'react'
import { donationSplit } from '@/lib/staticContent'

// GHS, matching the donations table's default currency and what actually
// gets charged — showing dollar amounts while billing GHS would be
// misleading about what the donor is agreeing to pay.
const DONATION_AMOUNTS = [20, 50, 100]

export default function SupportBox({ authorNames, articleSlug }: { authorNames: string; articleSlug: string }) {
  const [amount, setAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = customAmount ? Number(customAmount) : amount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!donorEmail.includes('@')) {
      setError('Enter a valid email — Paystack sends your receipt there.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/donations/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug, amount: effectiveAmount, donorName, donorEmail }),
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.authorizationUrl) {
      setLoading(false)
      setError(data?.error || 'Something went wrong starting the payment.')
      return
    }

    window.location.href = data.authorizationUrl
  }

  return (
    <div className="border-l-4 border-gold bg-royal-blue text-white p-6 my-8">
      <h2 className="kicker text-gold mb-2">Support This Research</h2>
      <p className="text-white/75 text-sm leading-relaxed mb-4">
        Found this article valuable? Send a direct contribution to {authorNames || 'the author(s)'}.
        {' '}{donationSplit.authorPercent}% goes to the author(s); Gulf Spectrum Journal (GoGMI)
        retains {donationSplit.platformPercent}% to sustain the platform.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-gold bg-white/10 p-3">{error}</p>}

        <div className="flex flex-wrap gap-2">
          {DONATION_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a)
                setCustomAmount('')
              }}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                amount === a && !customAmount ? 'bg-gold text-ink' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              GHS {a}
            </button>
          ))}
          <input
            type="number"
            min="1"
            placeholder="Other (GHS)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-28 px-3 py-2 text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-white/20"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="px-3 py-2 text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-white/20"
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="px-3 py-2 text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-white/20"
          />
        </div>

        <button
          type="submit"
          disabled={!effectiveAmount || loading}
          className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 transition-colors tracking-wide disabled:opacity-50"
        >
          {loading ? 'Redirecting to Paystack…' : `Donate GHS ${effectiveAmount || 0}`}
        </button>
        <p className="text-xs text-white/50">
          You&apos;ll complete payment on Paystack&apos;s secure page — we never see or store your
          card details.
        </p>
      </form>
    </div>
  )
}
