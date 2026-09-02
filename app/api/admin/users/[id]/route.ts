// Changes one account's role. profiles.role is revoked from
// authenticated/anon at the column level specifically to prevent a
// signed-in user from PATCHing their own row to 'admin' — so this is
// the only path that can write it, and it's gated on the CALLER already
// being an admin (checked via their own session, not anything the
// request body claims).
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/lib/types'

const VALID_ROLES: UserRole[] = ['reader', 'author', 'editor', 'admin']

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user: caller },
  } = await supabase.auth.getUser()
  if (!caller) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', caller.id).single()
  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const role = body?.role as UserRole | undefined
  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Guard against locking everyone out of admin: if this would demote
  // the last remaining admin (including a self-demotion), refuse.
  if (role !== 'admin') {
    const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin')
    const { data: target } = await admin.from('profiles').select('role').eq('id', id).single()
    if (target?.role === 'admin' && (count ?? 0) <= 1) {
      return NextResponse.json({ error: "Can't remove the last admin — promote someone else first." }, { status: 400 })
    }
  }

  const { error } = await admin.from('profiles').update({ role }).eq('id', id)
  if (error) {
    console.error('Failed to update role', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
