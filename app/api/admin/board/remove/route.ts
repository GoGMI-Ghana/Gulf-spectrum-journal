// Removes someone from the editorial board. Deliberately doesn't touch
// their `role` — an admin might still want them to keep editor access
// for other reasons, and silently downgrading it here would be a
// surprising side effect of what's meant to be "take the board title
// away". Change role separately, from Users & Roles, if that's wanted.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(request: Request) {
  const check = await requireAdmin()
  if (check.error) return check.error

  const body = await request.json().catch(() => null)
  const userId = body?.userId as string | undefined
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ board_title: null }).eq('id', userId)
  if (error) {
    console.error('Failed to remove board membership', error)
    return NextResponse.json({ error: 'Failed to remove board membership' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
