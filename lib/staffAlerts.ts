// Shared by the two public intake routes (app/api/contact and
// app/api/submissions): validating what a visitor typed, and emailing the
// editorial office once it has been saved.
//
// Those forms used to write straight to Supabase from the browser. They go
// through a route now for one reason: so a server can send that email — a
// message nobody knows has arrived is as good as lost.
import { after } from 'next/server'
import { isMailerConfigured, sendStaffAlertEmail, type StaffAlert } from './msGraphMailer'
import { journal } from './staticContent'

export const siteAdminUrl = (path: string) => `https://${journal.domain}${path}`

type FieldRule = { max: number; required?: boolean; email?: boolean }

// Returns the cleaned values, or an error message fit to show the visitor.
// The limits are generous — they exist to stop a multi-megabyte post, not
// to police real messages — and the forms set matching maxLength values.
export function readFields<K extends string>(
  body: unknown,
  rules: Record<K, FieldRule>
): { values: Record<K, string>; error: null } | { values: null; error: string } {
  if (!body || typeof body !== 'object') return { values: null, error: 'Invalid request.' }
  const input = body as Record<string, unknown>
  const values = {} as Record<K, string>
  for (const key of Object.keys(rules) as K[]) {
    const rule = rules[key]
    const raw = input[key]
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (rule.required && value === '') return { values: null, error: 'Please fill in every required field.' }
    if (value.length > rule.max) return { values: null, error: `One of the fields is too long (limit ${rule.max} characters).` }
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { values: null, error: 'Enter a valid email address.' }
    values[key] = value
  }
  return { values, error: null }
}

// The forms carry a field no person sees or fills in. Automated form
// spammers fill in everything, so a value there marks the post as theirs —
// the route then answers "ok" without saving or emailing anything.
export function isBotPost(body: unknown): boolean {
  const trap = (body as Record<string, unknown> | null)?.website
  return typeof trap === 'string' && trap.trim() !== ''
}

// Sent after the response, not before it: the visitor's message is already
// saved, so they shouldn't wait on the mail service — and a mail failure
// must not turn a successful submission into an error on their screen. It
// is logged instead; the message is still in /admin either way.
export function alertEditorialOffice(alert: StaffAlert) {
  if (!isMailerConfigured()) return
  after(async () => {
    try {
      await sendStaffAlertEmail(journal.contactEmail, alert)
    } catch (err) {
      console.error('Failed to email the editorial office', alert.subject, err)
    }
  })
}
