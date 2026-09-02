// Server-side Supabase client — for use inside Server Components, Route
// Handlers, and Server Actions. Reads/writes the auth cookie so a signed-in
// session persists across server-rendered requests. Live: points at the
// same self-hosted instance as lib/supabase/client.ts.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // setAll called from a Server Component — safe to ignore when
            // middleware is refreshing the session (see middleware.ts).
          }
        },
      },
    }
  )
}
