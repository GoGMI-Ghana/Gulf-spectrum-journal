// Sends email — auth emails (OTP codes, password recovery, etc.), the
// new-issue announcement to members (called from
// app/api/admin/issues/[id]/announce) and alerts to the editorial office
// about new contact messages and submissions (lib/staffAlerts.ts) — via Microsoft
// Graph's sendMail API, using an Azure app registration's client
// credentials (app-only OAuth, not a signed-in user) — the modern
// replacement for plain SMTP now that Microsoft 365 locks that down by
// default. Auth emails are called from app/api/auth/send-email-hook, GoTrue's "Send
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
  // Neutral wording: the same one-time code email is used for signing in
  // and for confirming a password change in Account Settings (GoTrue
  // reports both as 'magiclink', so they can't be told apart here).
  magiclink: {
    subject: 'Your Gulf Spectrum Journal verification code',
    intro: 'Use this code to sign in, or to confirm a change to your Gulf Spectrum Journal account.',
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

const recipients = (addresses: string[]) => addresses.map((address) => ({ emailAddress: { address } }))

async function sendGraphMail(
  accessToken: string,
  message: { subject: string; html: string; to: string[]; bcc?: string[]; replyTo?: string }
): Promise<void> {
  const sender = process.env.MS_SENDER_EMAIL!
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject: message.subject,
        body: { contentType: 'HTML', content: message.html },
        toRecipients: recipients(message.to),
        bccRecipients: recipients(message.bcc ?? []),
        replyTo: recipients(message.replyTo ? [message.replyTo] : []),
      },
      saveToSentItems: false,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Microsoft Graph sendMail failed: ${res.status} ${text}`)
  }
}

export async function sendAuthEmail(toEmail: string, actionType: EmailActionType, token: string): Promise<void> {
  const accessToken = await getGraphAccessToken()
  const copy = COPY[actionType] ?? { subject: 'Your Gulf Spectrum Journal code' }
  await sendGraphMail(accessToken, { subject: copy.subject, html: buildEmailHtml(actionType, token), to: [toEmail] })
}

// --- New-issue announcement ------------------------------------------

export function isMailerConfigured(): boolean {
  return Boolean(
    process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET && process.env.MS_SENDER_EMAIL
  )
}

export interface IssueAnnouncement {
  number: number
  theme: string
  aboutThisVolume: string | null
  issueUrl: string
  settingsUrl: string
}

// Issue fields are editor-entered free text going into HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildAnnouncementHtml(issue: IssueAnnouncement): string {
  const about = issue.aboutThisVolume
    ? `<p style="font-size:15px; color:#12202e; line-height:1.6; margin:0 0 24px;">${escapeHtml(issue.aboutThisVolume)}</p>`
    : ''
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
                <p style="font-size:12px; color:#b8860b; letter-spacing:0.15em; text-transform:uppercase; margin:0 0 8px;">New issue &middot; No. ${issue.number}</p>
                <h1 style="font-size:22px; color:#003366; line-height:1.3; margin:0 0 20px;">${escapeHtml(issue.theme)}</h1>
                ${about}
                <a href="${escapeHtml(issue.issueUrl)}" style="display:inline-block; background-color:#DAA520; color:#12202e; font-size:15px; font-weight:bold; text-decoration:none; padding:12px 24px;">Read the issue</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px; border-top:1px solid #e2e8f0;">
                <p style="font-size:11px; color:#94a3b8; line-height:1.6; margin:0;">
                  Gulf Spectrum Journal, a publication of the Gulf of Guinea Maritime Institute (GoGMI).
                  You are receiving this because you have a Gulf Spectrum Journal account.
                  To stop these emails, turn off new-issue emails in your
                  <a href="${escapeHtml(issue.settingsUrl)}" style="color:#64748b;">account settings</a>.
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

// Microsoft Graph accepts up to 500 recipients per message; well under
// that so one bad address or a throttled call only costs a small batch.
const ANNOUNCEMENT_BATCH_SIZE = 50

// Sends one identical message per batch with every member in BCC (and
// the journal's own mailbox in To), so recipients never see each other's
// addresses. Batches run one at a time — Exchange Online throttles a
// mailbox at roughly 30 messages a minute, and this stays far below it.
// A failed batch is logged and counted rather than aborting the rest.
export async function sendIssueAnnouncement(
  emails: string[],
  issue: IssueAnnouncement
): Promise<{ sent: number; failed: number }> {
  const accessToken = await getGraphAccessToken()
  const subject = `New issue of Gulf Spectrum Journal: ${issue.theme}`
  const html = buildAnnouncementHtml(issue)

  let sent = 0
  let failed = 0
  for (let i = 0; i < emails.length; i += ANNOUNCEMENT_BATCH_SIZE) {
    const batch = emails.slice(i, i + ANNOUNCEMENT_BATCH_SIZE)
    try {
      await sendGraphMail(accessToken, { subject, html, to: [process.env.MS_SENDER_EMAIL!], bcc: batch })
      sent += batch.length
    } catch (err) {
      console.error('Failed to send an issue announcement batch', err)
      failed += batch.length
    }
  }
  return { sent, failed }
}

// --- Alerts to the editorial office -----------------------------------

export interface StaffAlert {
  subject: string
  heading: string
  // Shown as a label/value list. Values are visitor-typed text.
  fields: { label: string; value: string }[]
  // The visitor's address, so "Reply" in the office's mail client goes
  // straight to them rather than back to the journal's own mailbox.
  replyTo: string
  adminUrl: string
  adminLabel: string
}

function buildStaffAlertHtml(alert: StaffAlert): string {
  const rows = alert.fields
    .map(
      (field) => `
                <p style="font-size:11px; color:#94a3b8; letter-spacing:0.1em; text-transform:uppercase; margin:0 0 3px;">${escapeHtml(field.label)}</p>
                <p style="font-size:14px; color:#12202e; line-height:1.6; margin:0 0 18px; white-space:pre-wrap;">${escapeHtml(field.value)}</p>`
    )
    .join('')
  return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff; max-width:520px; width:100%;">
            <tr>
              <td style="background-color:#003366; padding:24px 32px;">
                <div style="color:#ffffff; font-size:18px; font-weight:bold;">Gulf Spectrum Journal</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="font-size:19px; color:#003366; line-height:1.3; margin:0 0 22px;">${escapeHtml(alert.heading)}</h1>${rows}
                <a href="${escapeHtml(alert.adminUrl)}" style="display:inline-block; background-color:#DAA520; color:#12202e; font-size:14px; font-weight:bold; text-decoration:none; padding:11px 22px;">${escapeHtml(alert.adminLabel)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px; border-top:1px solid #e2e8f0;">
                <p style="font-size:11px; color:#94a3b8; line-height:1.6; margin:0;">
                  Sent automatically by the Gulf Spectrum Journal website. Replying to this email writes to the person who sent it.
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

export async function sendStaffAlertEmail(toEmail: string, alert: StaffAlert): Promise<void> {
  const accessToken = await getGraphAccessToken()
  await sendGraphMail(accessToken, {
    subject: alert.subject,
    html: buildStaffAlertHtml(alert),
    to: [toEmail],
    replyTo: alert.replyTo,
  })
}
