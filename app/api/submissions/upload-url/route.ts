// Issues a one-time upload URL for a submission's manuscript.
//
// The manuscripts bucket is private and has no public write access. The
// file itself goes from the author's browser straight to Storage (not
// through this server, whose request size limit is far below a
// manuscript's), but only via a signed URL this route creates with the
// service role — after checking the file is a document type and size the
// journal accepts. The path is chosen here, never by the browser.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isBotPost } from '@/lib/staffAlerts'
import { MANUSCRIPT_BUCKET, MANUSCRIPT_MAX_BYTES, MANUSCRIPT_MAX_MB, manuscriptContentType, manuscriptExtension } from '@/lib/manuscripts'

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'File uploads are not configured.' }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as { fileName?: unknown; size?: unknown } | null
  // Same trap field as the form itself — a bot gets a harmless refusal.
  if (isBotPost(body)) return NextResponse.json({ error: 'Upload not available.' }, { status: 400 })

  const fileName = typeof body?.fileName === 'string' ? body.fileName : ''
  const size = typeof body?.size === 'number' ? body.size : NaN
  const extension = manuscriptExtension(fileName)
  if (!extension) {
    return NextResponse.json({ error: 'Attach a Word, PDF, OpenDocument or RTF file.' }, { status: 400 })
  }
  if (!(size > 0) || size > MANUSCRIPT_MAX_BYTES) {
    return NextResponse.json({ error: `The file must be ${MANUSCRIPT_MAX_MB} MB or smaller.` }, { status: 400 })
  }

  const path = `submissions/${crypto.randomUUID()}.${extension}`
  const { data, error } = await createAdminClient().storage.from(MANUSCRIPT_BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('Failed to create manuscript upload URL', error)
    return NextResponse.json({ error: 'The upload could not be started. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ path: data.path, token: data.token, contentType: manuscriptContentType(extension) })
}
