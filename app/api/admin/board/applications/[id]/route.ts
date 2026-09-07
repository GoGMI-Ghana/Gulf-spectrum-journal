// Approves or declines one editorial board application. Approving does
// two things atomically-in-spirit (two sequential writes, not a real
// transaction, but the second failing just leaves the application
// "approved" without the membership grant applied — surfaced as an
// error rather than silently dropped): marks the application decided,
// and grants membership via the same helper the direct-assign route
// uses.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/adminAuth'
import { grantBoardMembership } from '@/lib/board'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const check = await requireAdmin()
  if (check.error) return check.error

  const body = await request.json().catch(() => null)
  const decision = body?.decision as 'approved' | 'declined' | undefined
  if (decision !== 'approved' && decision !== 'declined') {
    return NextResponse.json({ error: "decision must be 'approved' or 'declined'" }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: application, error: fetchError } = await admin
    .from('editorial_board_applications')
    .select('id, user_id, status')
    .eq('id', id)
    .single()
  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  if (application.status !== 'pending') {
    return NextResponse.json({ error: 'This application was already decided' }, { status: 400 })
  }

  if (decision === 'approved') {
    const title = (body?.title as string | undefined)?.trim() || 'Editorial Board Member'
    const { error: grantError } = await grantBoardMembership(admin, application.user_id, title)
    if (grantError) {
      console.error('Failed to grant board membership on approval', grantError)
      return NextResponse.json({ error: grantError }, { status: 500 })
    }
  }

  const { error } = await admin
    .from('editorial_board_applications')
    .update({ status: decision, reviewed_by: check.user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Failed to record application decision', error)
    return NextResponse.json({ error: 'Failed to record decision' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
