// Deletes the CALLER's own account — nothing else. The cookie-aware
// server client establishes who's actually calling from their real
// session; only then does the admin (service-role) client get used, and
// only ever against that same verified id. Cascades through profiles ->
// bookmarks/conversations/messages/notifications via the existing
// `on delete cascade` foreign keys, so this one call removes everything.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Same guard as the role-change route (app/api/admin/users/[id]): the
  // last remaining admin can't remove themselves, or nobody would be left
  // who can manage users, roles or the editorial board — recovering from
  // that takes direct database access.
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'admin') {
    const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin')
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: "You're the only admin. Make someone else an admin in Users & Roles before deleting this account." },
        { status: 400 }
      )
    }
  }

  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('Failed to delete account', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
