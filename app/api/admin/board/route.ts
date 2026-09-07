// Lists current board members and every application (pending first) for
// the admin Board page. Needs the service-role client for the same
// reason /api/admin/users does: emails live in auth.users, not
// profiles, and profiles' own RLS doesn't expose everyone's row to a
// plain "editors manage" policy — only this admin-gated route does.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const check = await requireAdmin()
  if (check.error) return check.error

  const admin = createAdminClient()

  const [{ data: authUsers, error: authError }, { data: profiles, error: profileError }, { data: applications, error: appError }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 500 }),
      // Unfiltered (not just board members) so applicant names below
      // can be looked up even for someone who isn't on the board (yet,
      // or ever, if declined).
      admin.from('profiles').select('id, full_name, board_title, role'),
      admin
        .from('editorial_board_applications')
        .select('id, user_id, statement, status, created_at, reviewed_at')
        .order('created_at', { ascending: false }),
    ])

  if (authError || profileError || appError) {
    console.error('Failed to load board data', authError ?? profileError ?? appError)
    return NextResponse.json({ error: 'Failed to load board data' }, { status: 500 })
  }

  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? '']))
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))

  const members = (profiles ?? [])
    .filter((p) => p.board_title)
    .map((p) => ({
      id: p.id,
      fullName: p.full_name,
      email: emailById.get(p.id) ?? '',
      title: p.board_title as string,
      role: p.role,
    }))

  const applicationList = (applications ?? []).map((a) => ({
    id: a.id,
    userId: a.user_id,
    fullName: profileById.get(a.user_id)?.full_name ?? null,
    email: emailById.get(a.user_id) ?? '',
    statement: a.statement,
    status: a.status,
    createdAt: a.created_at,
    reviewedAt: a.reviewed_at,
  }))

  return NextResponse.json({ members, applications: applicationList })
}
