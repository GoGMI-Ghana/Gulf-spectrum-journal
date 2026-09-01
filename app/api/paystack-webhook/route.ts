// Paystack webhook — confirms a donation actually completed. Lives here in
// the frontend (Vercel), not as a Supabase Edge Function: the self-hosted
// stack's function gateway requires an `apikey` header on every request
// (verified directly against the live instance), and Paystack's webhook
// config has no way to send custom headers — it's just a plain URL. A
// Next.js Route Handler has no such gate, so this is the pragmatic fix,
// not the originally planned approach.
//
// Signature verification uses the raw request body (HMAC-SHA512 over the
// exact bytes Paystack sent) -- must run before any JSON parsing, since
// re-serializing the parsed body wouldn't byte-for-byte match what was
// signed.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface PaystackEvent {
  event: string
  data: {
    reference: string
    metadata?: {
      type?: 'donation'
      record_id?: string
    }
  }
}

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const computed = createHmac('sha512', secret).update(rawBody).digest('hex')
  const a = Buffer.from(computed, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 401 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as PaystackEvent

  if (event.event !== 'charge.success') {
    // Acknowledge and ignore anything we don't handle yet (refunds,
    // disputes, etc.) -- Paystack retries on non-2xx, so always 200 here.
    return NextResponse.json({ ok: true })
  }

  const { reference, metadata } = event.data
  if (!metadata?.record_id) {
    console.error('charge.success webhook missing metadata.record_id', reference)
    return NextResponse.json({ ok: true })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('donations')
    .update({ status: 'completed', payment_reference: reference })
    .eq('id', metadata.record_id)

  if (error) {
    console.error(`Failed to mark donation ${metadata.record_id} as completed`, error)
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
