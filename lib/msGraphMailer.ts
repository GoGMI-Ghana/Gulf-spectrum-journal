// Sends auth emails (OTP codes, password recovery, etc.) via Microsoft
// Graph's sendMail API, using an Azure app registration's client
// credentials (app-only OAuth, not a signed-in user) — the modern
// replacement for plain SMTP now that Microsoft 365 locks that down by
// default. Called from app/api/auth/send-email-hook, GoTrue's "Send
// Email Hook": GoTrue stops trying to send mail itself and instead POSTs
// here with the email + one-time code, and we're responsible for
// actually delivering it.
//
// Server-only: MS_CLIENT_SECRET must never reach the browser bundle.

interface GraphTokenResponse {
  access_token: string
}

async function getGraphAccessToken(): Promise<string> {
  const tenantId = process.env.MS_TENANT_ID!
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.MS_CLIENT_ID!,
      client_secret: process.env.MS_CLIENT_SECRET!,
      // .default asks for whatever application permissions were granted
      // to this app registration in Azure (Mail.Send, with admin
      // consent) rather than listing individual scopes here.
      scope: 'https://graph.microsoft.com/.default',
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to get Microsoft Graph access token: ${res.status} ${text}`)
  }
  const data = (await res.json()) as GraphTokenResponse
  return data.access_token
}

type EmailActionType = 'signup' | 'magiclink' | 'recovery' | 'email_change' | 'invite' | string

const COPY: Record<string, { subject: string; intro: string }> = {
  signup: {
    subject: 'Confirm your Gulf Spectrum Journal account',
    intro: 'Use this code to confirm your new Gulf Spectrum Journal account.',
  },
  magiclink: {
    subject: 'Your Gulf Spectrum Journal sign-in code',
    intro: 'Use this code to sign in to your Gulf Spectrum Journal account.',
  },
  recovery: {
    subject: 'Reset your Gulf Spectrum Journal password',
    intro: 'Use this code to reset your Gulf Spectrum Journal password.',
  },
  email_change: {
    subject: 'Confirm your new email address',
    intro: 'Use this code to confirm your new email address on Gulf Spectrum Journal.',
  },
}

// Table-based inline-styled HTML, same reasoning as
// public/email-templates/otp.html (which this replaces as the actual
// send path — that file is now unused by GoTrue once the hook is
// enabled, but left in place as a reference/fallback template).
function buildEmailHtml(actionType: EmailActionType, token: string): string {
  const copy = COPY[actionType] ?? { subject: 'Your Gulf Spectrum Journal code', intro: 'Use this code to continue.' }
  return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; max-width:480px; width:100%;">
            <tr>
              <td style="background-color:#003366; padding:24px 32px;">
                <div style="color:#ffffff; font-size:18px; font-weight:bold;">Gulf Spectrum Journal</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="font-size:15px; color:#12202e; line-height:1.6; margin:0 0 24px;">${copy.intro} It expires shortly, so enter it soon.</p>
                <div style="background-color:#f5e6d3; text-align:center; padding:20px; margin-bottom:24px;">
                  <span style="font-size:32px; font-weight:bold; letter-spacing:0.3em; color:#003366; font-family: 'Courier New', monospace;">${token}</span>
                </div>
                <p style="font-size:13px; color:#94a3b8; line-height:1.6; margin:0;">
                  Didn&apos;t request this? You can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px; border-top:1px solid #e2e8f0;">
                <p style="font-size:11px; color:#94a3b8; margin:0;">
                  Gulf Spectrum Journal, a publication of the Gulf of Guinea Maritime Institute (GoGMI).
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendAuthEmail(toEmail: string, actionType: EmailActionType, token: string): Promise<void> {
  const accessToken = await getGraphAccessToken()
  const sender = process.env.MS_SENDER_EMAIL!
  const copy = COPY[actionType] ?? { subject: 'Your Gulf Spectrum Journal code' }

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject: copy.subject,
        body: { contentType: 'HTML', content: buildEmailHtml(actionType, token) },
        toRecipients: [{ emailAddress: { address: toEmail } }],
      },
      saveToSentItems: false,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Microsoft Graph sendMail failed: ${res.status} ${text}`)
  }
}
