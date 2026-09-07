// Shared by the two admin routes that can put someone on the editorial
// board (a direct assignment, and approving an application) — both need
// the exact same two writes done together: set board_title, and bump
// role to 'editor' if it isn't already editor/admin (never downgrades
// an existing admin to editor).
import { createAdminClient } from './supabase/admin'

export async function grantBoardMembership(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  title: string
): Promise<{ error: string | null }> {
  const { data: profile, error: fetchError } = await admin.from('profiles').select('role').eq('id', userId).single()
  if (fetchError || !profile) {
    return { error: fetchError?.message ?? 'User not found' }
  }
  const nextRole = profile.role === 'admin' || profile.role === 'editor' ? profile.role : 'editor'
  const { error } = await admin.from('profiles').update({ board_title: title, role: nextRole }).eq('id', userId)
  return { error: error?.message ?? null }
}
