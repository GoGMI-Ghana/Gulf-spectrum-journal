// Lists every account for the Users & Roles admin page. Two data sources
// merged by id: auth.users (via the admin API — email lives there, not
// in profiles) and public.profiles (role, full_name). Both require the
// service-role admin client; profiles' own RLS only lets a user read
// their own row ("users read their own profile"), and there's no
// equivalent policy for reading everyone's, on purpose — this route is
// the one sanctioned way to see the full list, gated below on the
// caller actually being an admin themselves.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  }
  return { user }
}

export async function GET() {
  const check = await requireAdmin()
  if (check.error) return check.error

  const admin = createAdminClient()

  const [{ data: authUsers, error: authError }, { data: profiles, error: profileError }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 500 }),
    admin.from('profiles').select('id, full_name, role, author_id, created_at'),
  ])

  if (authError || profileError) {
    console.error('Failed to load users', authError ?? profileError)
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 })
  }

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))
  const users = authUsers.users.map((u) => {
    const profile = profileById.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      full_name: profile?.full_name ?? null,
      role: profile?.role ?? 'reader',
      author_id: profile?.author_id ?? null,
      created_at: profile?.created_at ?? u.created_at,
    }
  })

  return NextResponse.json({ users })
}
