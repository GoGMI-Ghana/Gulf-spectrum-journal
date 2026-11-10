// Called from the Profile page after a member saves their own author
// details or picture. Those writes go straight from the browser to
// Supabase (RLS: "claimed authors edit their own record"), so this is the
// step that refreshes the public pages. Only a member who really is
// linked to an author record may trigger it; the check reads the
// database with the caller's own session, never anything they send.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidateContent } from '@/lib/revalidateContent'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: authors } = await supabase.from('authors').select('id').eq('user_id', user.id).limit(1)
  if (!authors?.length) {
    return NextResponse.json({ error: 'No author profile is linked to this account' }, { status: 403 })
  }

  revalidateContent()
  return NextResponse.json({ revalidated: true })
}
