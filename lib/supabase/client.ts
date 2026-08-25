// Browser-side Supabase client — for use inside 'use client' components
// (e.g. a future real BookmarksContext, sign-in forms).
//
// Not wired to a live project yet: NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY are unset until GoGMI creates a Supabase
// project and the values are added to .env.local (see .env.example).

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
