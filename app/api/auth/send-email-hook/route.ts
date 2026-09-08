// GoTrue's "Send Email Hook" — configured on the self-hosted Auth
// service (GOTRUE_HOOK_SEND_EMAIL_ENABLED/_URI/_SECRETS) to call this
// instead of sending mail itself. Fires for every auth email: OTP
// sign-in codes (EmailOtpForm.tsx), password recovery, email-change
// confirmation, and sign-up confirmation (moot right now since
// ENABLE_EMAIL_AUTOCONFIRM skips that one, but the hook still fires for
// every action type GoTrue defines — we don't get to pick and choose).
//
// The request is signed per the Standard Webhooks spec (webhook-id/
// -timestamp/-signature headers); verifying it is what stops anyone who
// finds this URL from making us send arbitrary email through GoGMI's
// mailbox. GoTrue expects a specific failure shape back
// ({"error":{"http_code":...,"message":...}}), not a generic error
// response, or it won't surface anything useful in its own logs.
import { NextResponse } from 'next/server'
import { Webhook, WebhookVerificationError } from 'standardwebhooks'
import { sendAuthEmail } from '@/lib/msGraphMailer'

interface SendEmailHookPayload {
  user: { email: string }
  email_data: {
    token: string
    email_action_type: string
  }
}

function hookError(httpCode: number, message: string) {
  return NextResponse.json({ error: { http_code: httpCode, message } }, { status: httpCode })
}

export async function POST(request: Request) {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET
  if (!secret) {
    // Same honest-failure pattern as /api/donations/initiate when
    // PAYSTACK_SECRET_KEY is unset: a clear 503 instead of a confusing
    // downstream crash, since this genuinely isn't configured yet.
    return hookError(503, 'Send email hook is not configured.')
  }

  const payload = await request.text()
  const headers = Object.fromEntries(request.headers)

  let data: SendEmailHookPayload
  try {
    data = new Webhook(secret).verify(payload, headers) as SendEmailHookPayload
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return hookError(401, 'Invalid webhook signature')
    }
    throw err
  }

  try {
    await sendAuthEmail(data.user.email, data.email_data.email_action_type, data.email_data.token)
  } catch (err) {
    console.error('Failed to send auth email via Microsoft Graph', err)
    return hookError(500, 'Failed to send email')
  }

  return NextResponse.json({})
}
