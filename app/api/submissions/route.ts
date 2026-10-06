// Receives the public "Start Your Submission" form: saves the proposal
// for /admin/submissions and emails the editorial office that it arrived.
// Same shape and reasoning as app/api/contact.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/staticClient'
import { alertEditorialOffice, isBotPost, readFields, siteAdminUrl } from '@/lib/staffAlerts'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (isBotPost(body)) return NextResponse.json({ ok: true })

  const { values, error } = readFields(body, {
    name: { max: 200, required: true },
    email: { max: 320, required: true, email: true },
    title: { max: 500, required: true },
    abstract: { max: 10000 },
  })
  if (error !== null) return NextResponse.json({ error }, { status: 400 })

  const { error: insertError } = await createClient()
    .from('submissions')
    .insert({ name: values.name, email: values.email, title: values.title, abstract: values.abstract || null })
  if (insertError) {
    console.error('Failed to save submission', insertError)
    return NextResponse.json({ error: 'Your proposal could not be sent. Please try again.' }, { status: 500 })
  }

  alertEditorialOffice({
    subject: `New article proposal: ${values.title}`,
    heading: 'New article proposal',
    fields: [
      { label: 'From', value: `${values.name} <${values.email}>` },
      { label: 'Proposed title', value: values.title },
      { label: 'Abstract (draft)', value: values.abstract || '(none provided)' },
    ],
    replyTo: values.email,
    adminUrl: siteAdminUrl('/admin/submissions'),
    adminLabel: 'Review in the admin panel',
  })

  return NextResponse.json({ ok: true })
}
