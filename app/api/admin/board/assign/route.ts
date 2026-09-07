// Directly puts someone on the editorial board, bypassing the
// application flow — for when an admin wants to add someone who never
// applied. Same underlying write as approving an application (see
// app/api/admin/board/applications/[id]/route.ts); both call
// grantBoardMembership so the "bump to editor" logic can't drift apart
// between the two entry points.
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/adminAuth'
import { grantBoardMembership } from '@/lib/board'

export async function POST(request: Request) {
  const check = await requireAdmin()
  if (check.error) return check.error

  const body = await request.json().catch(() => null)
  const userId = body?.userId as string | undefined
  const title = (body?.title as string | undefined)?.trim()
  if (!userId || !title) {
    return NextResponse.json({ error: 'userId and title are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await grantBoardMembership(admin, userId, title)
  if (error) {
    console.error('Failed to assign board membership', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
