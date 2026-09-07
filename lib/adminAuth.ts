// Shared by every /api/admin/* route: confirms the CALLER (via their own
// session cookie, never anything the request body claims) is actually an
// admin before the route does anything with the service-role client.
// profiles.role can't be spoofed here — it's read straight from the DB,
// not trusted from the client.
import { NextResponse } from 'next/server'
import { createClient } from './supabase/server'

export async function requireAdmin() {
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
