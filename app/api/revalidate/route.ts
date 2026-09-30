// Called by the admin panel after an editor saves or deletes an article,
// issue, author or topic (see lib/refreshPublicSite.ts) — those writes go
// straight from the browser to Supabase, so there's no server step of
// their own to hook the refresh into. Editor-gated only to stop anonymous
// callers from forcing needless regeneration; it doesn't expose or change
// any data.
import { NextResponse } from 'next/server'
import { requireEditor } from '@/lib/adminAuth'
import { revalidateContent } from '@/lib/revalidateContent'

export async function POST() {
  const auth = await requireEditor()
  if (auth.error) return auth.error

  revalidateContent()
  return NextResponse.json({ revalidated: true })
}
