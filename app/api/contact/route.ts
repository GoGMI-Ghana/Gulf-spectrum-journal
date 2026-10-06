// Receives the public Contact form: saves the message for /admin/messages
// and emails the editorial office that it arrived. The save uses the same
// anonymous access the form used to use directly from the browser (RLS:
// "anyone can send a contact message") — this route adds the email, not
// any extra privilege.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/staticClient'
import { alertEditorialOffice, isBotPost, readFields, siteAdminUrl } from '@/lib/staffAlerts'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (isBotPost(body)) return NextResponse.json({ ok: true })

  const { values, error } = readFields(body, {
    name: { max: 200, required: true },
    email: { max: 320, required: true, email: true },
    subject: { max: 300, required: true },
    message: { max: 10000, required: true },
  })
  if (error !== null) return NextResponse.json({ error }, { status: 400 })

  const { error: insertError } = await createClient().from('contact_messages').insert(values)
  if (insertError) {
    console.error('Failed to save contact message', insertError)
    return NextResponse.json({ error: 'Your message could not be sent. Please try again.' }, { status: 500 })
  }

  alertEditorialOffice({
    subject: `Contact form: ${values.subject}`,
    heading: 'New message from the contact form',
    fields: [
      { label: 'From', value: `${values.name} <${values.email}>` },
      { label: 'Subject', value: values.subject },
      { label: 'Message', value: values.message },
    ],
    replyTo: values.email,
    adminUrl: siteAdminUrl('/admin/messages'),
    adminLabel: 'Open in the admin panel',
  })

  return NextResponse.json({ ok: true })
}
