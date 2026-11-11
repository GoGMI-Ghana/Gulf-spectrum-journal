// Server-only: confirming a donation with Paystack and recording it.
//
// Two paths reach this, and either one is enough on its own:
// - /api/donations/verify, where Paystack sends the donor back after
//   paying. This is the main path, because the GoGMI Paystack account is
//   shared with another site and a Paystack account has only one webhook
//   URL, which belongs to that other site.
// - /api/paystack-webhook, in case that webhook is ever pointed here.
// Marking a donation completed is idempotent, so both running is harmless.
import { createAdminClient } from './supabase/admin'

const PAYSTACK_API = 'https://api.paystack.co'

export type DonationMetadata = { type?: string; record_id?: string; article_slug?: string }

export function parseMetadata(raw: unknown): DonationMetadata {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as DonationMetadata
    } catch {
      return {}
    }
  }
  return (raw && typeof raw === 'object' ? raw : {}) as DonationMetadata
}

// Asks Paystack itself whether the transaction succeeded (never trusting
// anything in the browser's address bar) and, if it did, marks the
// matching donation completed. Returns the article slug for the redirect.
export async function confirmDonation(
  reference: string
): Promise<{ ok: boolean; articleSlug: string | null }> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return { ok: false, articleSlug: null }

  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => null)
  const tx = body?.data
  const metadata = parseMetadata(tx?.metadata)
  const articleSlug = metadata.article_slug && /^[a-z0-9-]+$/.test(metadata.article_slug) ? metadata.article_slug : null

  if (!res.ok || tx?.status !== 'success' || metadata.type !== 'donation' || !metadata.record_id) {
    return { ok: false, articleSlug }
  }

  const ok = await markDonationCompleted(metadata.record_id, tx.reference ?? reference, tx.amount, tx.currency)
  return { ok, articleSlug }
}

// Marks a donation completed, but only if Paystack's amount and currency
// match what was recorded when the donor started, so a payment for a
// different amount can't complete someone else's donation record.
export async function markDonationCompleted(
  donationId: string,
  reference: string,
  amountMinorUnits: number | undefined,
  currency: string | undefined
): Promise<boolean> {
  const admin = createAdminClient()
  const { data: row, error: readError } = await admin
    .from('donations')
    .select('amount_minor_units, currency, status')
    .eq('id', donationId)
    .maybeSingle()

  if (readError || !row) {
    console.error(`Donation ${donationId} not found`, readError)
    return false
  }
  if (row.status === 'completed') return true
  if (
    (amountMinorUnits !== undefined && Number(amountMinorUnits) !== Number(row.amount_minor_units)) ||
    (currency !== undefined && currency !== row.currency)
  ) {
    console.error(`Donation ${donationId}: Paystack amount/currency does not match the record`)
    return false
  }

  const { error } = await admin
    .from('donations')
    .update({ status: 'completed', payment_reference: reference })
    .eq('id', donationId)
  if (error) {
    console.error(`Failed to mark donation ${donationId} as completed`, error)
    return false
  }
  return true
}
