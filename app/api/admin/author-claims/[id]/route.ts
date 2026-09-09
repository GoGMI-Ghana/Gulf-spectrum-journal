// Approves or declines a self-service author claim. The claim row and
// the authors table itself are both editor-writable via RLS directly,
// but linking profiles.author_id needs the service-role client --
// that column is revoked from authenticated/anon (same protection as
// role and board_title) so a signed-in user can't link themselves to
// an author record without going through review.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireEditor } from '@/lib/adminAuth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const check = await requireEditor()
  if (check.error) return check.error

  const body = await request.json().catch(() => null)
  const decision = body?.decision as 'approved' | 'declined' | undefined
  if (decision !== 'approved' && decision !== 'declined') {
    return NextResponse.json({ error: "decision must be 'approved' or 'declined'" }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: claim, error: fetchError } = await admin
    .from('author_claims')
    .select('id, user_id, author_id, status')
    .eq('id', id)
    .single()
  if (fetchError || !claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
  }
  if (claim.status !== 'pending') {
    return NextResponse.json({ error: 'This claim was already decided' }, { status: 400 })
  }

  if (decision === 'approved') {
    // Refuse if the author got claimed by someone else (or the user
    // linked elsewhere) since this claim was submitted, rather than
    // silently overwriting either link.
    const [{ data: author }, { data: profile }] = await Promise.all([
      admin.from('authors').select('user_id').eq('id', claim.author_id).single(),
      admin.from('profiles').select('author_id').eq('id', claim.user_id).single(),
    ])
    if (author?.user_id) {
      return NextResponse.json({ error: 'This author profile has already been claimed by someone else.' }, { status: 409 })
    }
    if (profile?.author_id) {
      return NextResponse.json({ error: 'This account is already linked to a different author profile.' }, { status: 409 })
    }

    const [authorUpdate, profileUpdate] = await Promise.all([
      admin.from('authors').update({ user_id: claim.user_id }).eq('id', claim.author_id),
      admin.from('profiles').update({ author_id: claim.author_id }).eq('id', claim.user_id),
    ])
    if (authorUpdate.error || profileUpdate.error) {
      console.error('Failed to link author claim', authorUpdate.error ?? profileUpdate.error)
      return NextResponse.json({ error: 'Failed to link the author profile' }, { status: 500 })
    }
  }

  const { error } = await admin
    .from('author_claims')
    .update({ status: decision, reviewed_by: check.user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Failed to record claim decision', error)
    return NextResponse.json({ error: 'Failed to record decision' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
