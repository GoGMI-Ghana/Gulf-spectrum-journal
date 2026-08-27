'use client'

import { useState } from 'react'
import { donationSplit } from '@/lib/staticContent'

const DONATION_AMOUNTS = [10, 25, 50]

export default function SupportBox({ authorNames }: { authorNames: string }) {
  const [amount, setAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const effectiveAmount = customAmount ? Number(customAmount) : amount

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="border-l-4 border-gold bg-royal-blue text-white p-6 my-8">
      <h2 className="kicker text-gold mb-2">Support This Research</h2>
      <p className="text-white/75 text-sm leading-relaxed mb-4">
        Found this article valuable? Send a direct contribution to {authorNames || 'the author(s)'}.
        {' '}{donationSplit.authorPercent}% goes to the author(s); Gulf Spectrum Journal (GoGMI)
        retains {donationSplit.platformPercent}% to sustain the platform.
      </p>

      {submitted ? (
        <p className="text-sm text-gold bg-white/10 p-3">
          Thank you — this is a design prototype, so no payment was processed and no
          money has changed hands. Connecting a real payment provider (e.g. Paystack,
          Flutterwave, or Stripe) and setting the actual author/platform split is a
          follow-up integration GoGMI would need to configure, including author payout
          details and compliance review.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
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
                  amount === a && !customAmount
                    ? 'bg-gold text-ink'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ${a}
              </button>
            ))}
            <input
              type="number"
              min="1"
              placeholder="Other"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-24 px-3 py-2 text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-white/20"
            />
          </div>
          <button
            type="submit"
            disabled={!effectiveAmount}
            className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 transition-colors tracking-wide disabled:opacity-50"
          >
            Donate ${effectiveAmount || 0}
          </button>
        </form>
      )}
    </div>
  )
}
