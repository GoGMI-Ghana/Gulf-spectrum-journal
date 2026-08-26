'use client'

import { useState } from 'react'

export default function JoinForm({ tierName, invitationOnly }: { tierName: string; invitationOnly: boolean }) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.currentTarget.reset()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-4">
        Thank you — this is a design prototype, so no application was submitted and no
        payment was processed. Real enrollment (and a real payment provider, for tiers
        with dues) is a follow-up integration for GoGMI to configure.
      </p>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="join-name">
          Full name
        </label>
        <input
          id="join-name"
          required
          type="text"
          className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="join-email">
          Email
        </label>
        <input
          id="join-email"
          required
          type="email"
          className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-3 transition-colors tracking-wide"
      >
        {invitationOnly ? `Request an Invitation — ${tierName}` : `Confirm Interest — ${tierName}`}
      </button>
      <p className="text-xs text-slate-400 leading-relaxed">
        This form does not collect payment details. GoGMI&apos;s membership office will
        follow up directly about enrollment and payment once this is connected to a
        real backend.
      </p>
    </form>
  )
}
