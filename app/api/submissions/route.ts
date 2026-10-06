// Receives the public "Start Your Submission" form: saves the proposal
// for /admin/submissions and emails the editorial office that it arrived.
// Same shape and reasoning as app/api/contact, plus an optional
// manuscript the browser has already uploaded (see upload-url/route.ts).
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/staticClient'
import { createAdminClient } from '@/lib/supabase/admin'
import { alertEditorialOffice, isBotPost, readFields, siteAdminUrl } from '@/lib/staffAlerts'
import { MANUSCRIPT_BUCKET, MANUSCRIPT_PATH_PATTERN, cleanManuscriptName } from '@/lib/manuscripts'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (isBotPost(body)) return NextResponse.json({ ok: true })

  const { values, error } = readFields(body, {
    name: { max: 200, required: true },
    email: { max: 320, required: true, email: true },
    title: { max: 500, required: true },
    abstract: { max: 10000 },
    manuscriptPath: { max: 200 },
    manuscriptName: { max: 400 },
  })
  if (error !== null) return NextResponse.json({ error }, { status: 400 })

  // A manuscript is recorded only if it is a path this site issued AND a
  // file was really uploaded there — the browser's word for neither.
  let manuscript: { path: string; name: string } | null = null
  if (values.manuscriptPath) {
    const exists =
      MANUSCRIPT_PATH_PATTERN.test(values.manuscriptPath) &&
      (await createAdminClient().storage.from(MANUSCRIPT_BUCKET).exists(values.manuscriptPath)).data === true
    if (!exists) {
      return NextResponse.json({ error: 'The manuscript upload did not complete. Please attach the file again.' }, { status: 400 })
    }
    manuscript = { path: values.manuscriptPath, name: cleanManuscriptName(values.manuscriptName) || 'manuscript' }
  }

  const { error: insertError } = await createClient()
    .from('submissions')
    .insert({
      name: values.name,
      email: values.email,
      title: values.title,
      abstract: values.abstract || null,
      manuscript_path: manuscript?.path ?? null,
      manuscript_name: manuscript?.name ?? null,
    })
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
      // The file itself stays in private storage — it's downloaded from
      // the admin panel, never attached to or linked from an email.
      { label: 'Manuscript', value: manuscript ? `${manuscript.name} — download it from the admin panel` : '(none attached)' },
    ],
    replyTo: values.email,
    adminUrl: siteAdminUrl('/admin/submissions'),
    adminLabel: 'Review in the admin panel',
  })

  return NextResponse.json({ ok: true })
}
