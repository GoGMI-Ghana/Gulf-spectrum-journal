// Browser-side Supabase client — used by AccountContext, the sign-in/
// sign-up forms, and anywhere else a 'use client' component needs to read
// or write as the signed-in visitor. Live: points at the self-hosted
// instance on GoGMI's VPS (see NEXT_PUBLIC_SUPABASE_URL/ANON_KEY in
// .env.local).

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
