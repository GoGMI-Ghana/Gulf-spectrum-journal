'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading } from './AdminUI'

type Status = 'pending' | 'completed' | 'failed'

interface DonationRow {
  id: string
  donor_name: string | null
  donor_email: string | null
  amount_minor_units: number
  currency: string
  status: Status
  created_at: string
  article: { slug: string; title: string } | { slug: string; title: string }[] | null
}

const STATUS_STYLE: Record<Status, string> = {
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  completed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  failed: 'text-red-700 bg-red-50 border-red-200',
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

// Read-only — donations are only ever written by the donor's own insert
// (via /api/donations/initiate) and the Paystack webhook. RLS grants
// editors SELECT here ("editors read donations"), nothing more.
export default function DonationsManager() {
  const [donations, setDonations] = useState<DonationRow[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('donations')
      .select('id, donor_name, donor_email, amount_minor_units, currency, status, created_at, article:articles(slug, title)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Failed to load donations', error)
        else setDonations(data as unknown as DonationRow[])
        setLoaded(true)
      })
  }, [])

  const completedTotal = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount_minor_units, 0)

  return (
    <div>
      <AdminHeading
        title="Donations"
        description={
          loaded
            ? `GHS ${(completedTotal / 100).toLocaleString()} received across ${donations.filter((d) => d.status === 'completed').length} completed donation(s).`
            : undefined
        }
      />

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : donations.length === 0 ? (
        <p className="text-slate-500 text-sm">No donations yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {donations.map((d) => {
            const article = one(d.article)
            return (
              <div key={d.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-royal-blue">
                    {d.currency} {(d.amount_minor_units / 100).toLocaleString()}{' '}
                    <span className={`ml-1 text-[10px] font-normal px-1.5 py-0.5 align-middle border ${STATUS_STYLE[d.status]}`}>{d.status}</span>
                  </p>
                  <p className="text-xs text-slate-500">{d.donor_name || 'Anonymous'} · {d.donor_email ?? 'no email'}</p>
                  {article && (
                    <Link href={`/articles/${article.slug}`} className="text-xs text-ocean-blue hover:underline">
                      {article.title}
                    </Link>
                  )}
                </div>
                <p className="text-xs text-slate-400 shrink-0">{new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
