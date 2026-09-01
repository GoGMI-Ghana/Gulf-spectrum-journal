// Starts a real Paystack checkout for a donation to an article's authors.
// Creates the donations row first (status 'pending' — the anon-key client
// can do this directly, RLS already allows "anyone can start a donation"),
// then asks Paystack for a hosted checkout URL and hands that back to the
// browser to redirect to. We never see or touch card details ourselves —
// Paystack's own page collects those, same reasoning as declining to build
// a custom card-entry form earlier in this project.
//
// PAYSTACK_SECRET_KEY is server-only (no NEXT_PUBLIC_ prefix) — this route
// is the only place it's used, alongside the webhook that confirms
// payment afterward (app/api/paystack-webhook).
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/staticClient'

const MIN_AMOUNT = 1
const MAX_AMOUNT = 100000 // sanity ceiling, GHS — not a real business limit

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Donations are not configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const articleSlug = typeof body?.articleSlug === 'string' ? body.articleSlug : null
  const amount = Number(body?.amount)
  const donorName = typeof body?.donorName === 'string' ? body.donorName.trim() : ''
  const donorEmail = typeof body?.donorEmail === 'string' ? body.donorEmail.trim() : ''

  if (!articleSlug || !Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return NextResponse.json({ error: 'Invalid donation request.' }, { status: 400 })
  }
  if (!donorEmail || !donorEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', articleSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (articleError || !article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 })
  }

  const amountMinorUnits = Math.round(amount * 100) // GHS -> pesewas

  const { data: donation, error: donationError } = await supabase
    .from('donations')
    .insert({
      article_id: article.id,
      donor_name: donorName || null,
      donor_email: donorEmail,
      amount_minor_units: amountMinorUnits,
      currency: 'GHS',
      payment_provider: 'paystack',
    })
    .select('id')
    .single()

  if (donationError || !donation) {
    console.error('Failed to create donation row', donationError)
    return NextResponse.json({ error: 'Could not start donation.' }, { status: 500 })
  }

  const origin = request.headers.get('origin') || new URL(request.url).origin

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: donorEmail,
      amount: amountMinorUnits,
      currency: 'GHS',
      callback_url: `${origin}/articles/${articleSlug}?donation=thanks`,
      metadata: { type: 'donation', record_id: donation.id },
    }),
  })

  const paystackData = await paystackRes.json().catch(() => null)

  if (!paystackRes.ok || !paystackData?.data?.authorization_url) {
    console.error('Paystack initialize failed', paystackData)
    // Leave the donation row as 'pending' -- it just never got a completed
    // payment attached; nothing to clean up, and it's a harmless audit trail.
    return NextResponse.json({ error: 'Could not reach the payment provider.' }, { status: 502 })
  }

  return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url })
}
