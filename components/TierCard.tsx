'use client'

import { useState } from 'react'
import type { MembershipTier } from '@/lib/types'

export default function TierCard({ tier }: { tier: MembershipTier }) {
  const [joined, setJoined] = useState(false)
  const invitationOnly = tier.price === 'By Invitation Only'

  return (
    <div className={`flex flex-col p-6 bg-white ${tier.featured ? 'border-2 border-gold' : 'border border-slate-200'}`}>
      {tier.featured && <p className="kicker text-gold mb-2">Most Popular</p>}
      <h3 className="font-semibold text-royal-blue font-display text-lg">{tier.name}</h3>
      {tier.subtitle && <p className="text-xs text-slate-500 mb-1">{tier.subtitle}</p>}
      <p className="numeral text-2xl font-bold text-royal-blue mt-2 mb-3">{tier.price}</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{tier.audience}</p>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.benefits.map((b) => (
          <li key={b} className="text-sm text-slate-700 flex gap-2">
            <span className="text-gold shrink-0">▸</span> {b}
          </li>
        ))}
      </ul>

      {joined ? (
        <p className="text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          Thank you — this is a design prototype, so no application was submitted and no
          payment was processed. Real enrollment and payment processing is a follow-up
          integration for GoGMI to configure.
        </p>
      ) : (
        <button
          onClick={() => setJoined(true)}
          className={`text-sm font-semibold px-4 py-2.5 transition-colors tracking-wide ${
            invitationOnly
              ? 'border border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white'
              : 'bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink'
          }`}
        >
          {invitationOnly ? 'Request an Invitation' : 'Join This Tier'}
        </button>
      )}
    </div>
  )
}
