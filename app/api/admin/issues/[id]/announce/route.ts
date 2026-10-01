// Emails every opted-in member that a new issue is out. Triggered by an
// editor from the admin Issues page (never automatically — an email can't
// be taken back the way an in-site notification can), and at most once
// per issue: issues.announcement_sent_at is claimed with a conditional
// update before anything is sent, so a double click, two editors, or an
// unpublish/republish can't produce a second email.
//
// Member email addresses live in auth.users, which only the service-role
// client can list — the reason this is a server route at all.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireEditor } from '@/lib/adminAuth'
import { isMailerConfigured, sendIssueAnnouncement } from '@/lib/msGraphMailer'
import { journal } from '@/lib/staticContent'

// Sending runs one batch at a time; give it room beyond the default
// function timeout for a large membership.
export const maxDuration = 60

const USERS_PER_PAGE = 1000

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireEditor()
  if (auth.error) return auth.error

  if (!isMailerConfigured()) {
    return NextResponse.json({ error: 'Email sending is not configured.' }, { status: 503 })
  }

  const { id } = await params
  const admin = createAdminClient()

  // The claim: succeeds for exactly one caller, and only for a published
  // issue that hasn't been announced yet.
  const { data: issue, error: claimError } = await admin
    .from('issues')
    .update({ announcement_sent_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'published')
    .is('announcement_sent_at', null)
    .select('slug, number, theme, about_this_volume')
    .maybeSingle()

  if (claimError) {
    console.error('Failed to claim issue announcement', claimError)
    return NextResponse.json({ error: 'Failed to start the announcement.' }, { status: 500 })
  }
  if (!issue) {
    return NextResponse.json(
      { error: 'This issue is not published, or its announcement email has already been sent.' },
      { status: 409 }
    )
  }

  // If nothing ends up being sent, hand the claim back so an editor can
  // try again later instead of the issue being stuck as "announced".
  const releaseClaim = () => admin.from('issues').update({ announcement_sent_at: null }).eq('id', id)

  const { data: optedIn, error: profilesError } = await admin.from('profiles').select('id').eq('email_notifications', true)
  if (profilesError) {
    console.error('Failed to load announcement recipients', profilesError)
    await releaseClaim()
    return NextResponse.json({ error: 'Failed to load recipients.' }, { status: 500 })
  }
  const optedInIds = new Set((optedIn ?? []).map((p) => p.id as string))

  const emails: string[] = []
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: USERS_PER_PAGE })
    if (error) {
      console.error('Failed to list members for announcement', error)
      await releaseClaim()
      return NextResponse.json({ error: 'Failed to load recipients.' }, { status: 500 })
    }
    for (const user of data.users) {
      if (user.email && optedInIds.has(user.id)) emails.push(user.email)
    }
    if (data.users.length < USERS_PER_PAGE) break
  }

  if (emails.length === 0) {
    await releaseClaim()
    return NextResponse.json({ error: 'No members are opted in to new-issue emails yet.' }, { status: 409 })
  }

  const siteUrl = `https://${journal.domain}`
  let result: { sent: number; failed: number }
  try {
    result = await sendIssueAnnouncement(emails, {
      number: issue.number,
      theme: issue.theme,
      aboutThisVolume: issue.about_this_volume,
      issueUrl: `${siteUrl}/issues/${issue.slug}`,
      settingsUrl: `${siteUrl}/account-settings`,
    })
  } catch (err) {
    console.error('Failed to send issue announcement', err)
    result = { sent: 0, failed: emails.length }
  }

  if (result.sent === 0) {
    await releaseClaim()
    return NextResponse.json({ error: 'The email could not be sent. Nothing went out, so you can try again.' }, { status: 502 })
  }

  return NextResponse.json(result)
}
