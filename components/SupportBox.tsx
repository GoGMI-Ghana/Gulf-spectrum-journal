'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

// GHS, matching the donations table's default currency and what actually
// gets charged — showing dollar amounts while billing GHS would be
// misleading about what the donor is agreeing to pay.
const DONATION_AMOUNTS = [20, 50, 100]

const FIELD =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-[0.9375rem] focus:outline-2 focus:-outline-offset-1 focus:outline-royal-blue focus:border-royal-blue'

// The amount choices are real radio buttons (one tab stop, arrow keys
// move between them, read out as "1 of 4"), styled as a row of buttons.
const CHOICE =
  'relative flex flex-1 items-center justify-center min-h-11 min-w-16 px-4 whitespace-nowrap border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer transition-colors hover:border-royal-blue has-[:checked]:bg-royal-blue has-[:checked]:border-royal-blue has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-royal-blue'

// Donations go to the journal (GoGMI) as a whole, not to individual
// authors. The article is still recorded with each donation, so the
// admin panel can see which articles prompt people to give.
export default function SupportBox({ articleSlug }: { articleSlug: string }) {
  const { t } = useI18n()
  const [choice, setChoice] = useState<number | 'other'>(50)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = choice === 'other' ? Number(customAmount) || 0 : choice

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!donorEmail.includes('@')) {
      setError(t.support.invalidEmail)
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
      setError(data?.error || t.support.startFailed)
      return
    }

    window.location.href = data.authorizationUrl
  }

  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className="scroll-mt-6 mt-12 border-t-2 border-royal-blue bg-slate-50 px-5 py-7 sm:px-8 sm:py-8 space-y-7"
    >
      <div>
        <h2 id="support-heading" className="font-display text-2xl text-royal-blue">
          {t.support.heading}
        </h2>
        <p className="text-slate-700 leading-relaxed mt-3 max-w-2xl">{t.support.body}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl border-t border-slate-200 pt-6" noValidate>
        <fieldset>
          <legend className="text-sm font-medium text-slate-700 mb-2">{t.support.amountLegend}</legend>
          <div className="flex flex-wrap gap-2">
            {DONATION_AMOUNTS.map((a) => (
              <label key={a} className={CHOICE}>
                <input
                  type="radio"
                  name="amount"
                  value={a}
                  checked={choice === a}
                  onChange={() => setChoice(a)}
                  className="sr-only"
                />
                {a}
              </label>
            ))}
            <label className={CHOICE}>
              <input
                type="radio"
                name="amount"
                value="other"
                checked={choice === 'other'}
                onChange={() => setChoice('other')}
                className="sr-only"
              />
              {t.support.otherAmountLabel}
            </label>
          </div>
        </fieldset>

        {choice === 'other' && (
          <div>
            <label htmlFor="support-other" className="block text-sm font-medium text-slate-700 mb-1">
              {t.support.otherAmountLabel} (GHS)
            </label>
            <input
              id="support-other"
              type="number"
              inputMode="decimal"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className={`${FIELD} max-w-40`}
              autoFocus
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="support-name" className="block text-sm font-medium text-slate-700 mb-1">
              {t.support.nameLabel}
            </label>
            <input
              id="support-name"
              type="text"
              autoComplete="name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="support-email" className="block text-sm font-medium text-slate-700 mb-1">
              {t.support.emailLabel}
            </label>
            <input
              id="support-email"
              type="email"
              autoComplete="email"
              required
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              aria-invalid={error === t.support.invalidEmail || undefined}
              className={FIELD}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={!effectiveAmount || loading}
            className="w-full sm:w-auto bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-3 transition-colors disabled:opacity-60"
          >
            {loading ? t.support.redirecting : fmt(t.support.donate, { amount: effectiveAmount || 0 })}
          </button>
          <p className="flex items-start gap-2 text-sm text-slate-600 mt-3">
            <Lock size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
            {t.support.secure}
          </p>
        </div>
      </form>
    </section>
  )
}
