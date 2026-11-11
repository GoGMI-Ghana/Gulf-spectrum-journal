// Where Paystack sends the donor back after the payment page. Paystack
// adds ?reference=… to the callback URL; the reference is only used to ask
// Paystack's API what happened, so a hand-typed URL can't fake a payment.
// The donor then lands back on the article with a thank-you (or a "not
// completed" note) above the donation box.
import { NextResponse } from 'next/server'
import { confirmDonation } from '@/lib/donations'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref')

  const result = reference ? await confirmDonation(reference) : { ok: false, articleSlug: null }

  const destination = new URL(result.articleSlug ? `/articles/${result.articleSlug}` : '/', url.origin)
  destination.searchParams.set('donation', result.ok ? 'thanks' : 'incomplete')
  destination.hash = 'support'
  return NextResponse.redirect(destination, 303)
}
