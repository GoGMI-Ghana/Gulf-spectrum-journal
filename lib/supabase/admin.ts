// Service-role Supabase client — bypasses RLS entirely. Server-only:
// importing this from anything that reaches the browser bundle would leak
// SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix on that env var on
// purpose). Only reach for this where the anon key genuinely can't do the
// job: deleting a user via Supabase Auth's admin API, and marking a
// donation completed once Paystack has confirmed it (lib/donations.ts),
// since donations' RLS deliberately lets nobody but editors touch them.

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
