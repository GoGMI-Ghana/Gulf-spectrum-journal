// Plain Supabase client — no cookies, no session. Used by lib/content.ts
// for public content reads (articles, topics, authors, issues), which are
// the same for every visitor and don't depend on who's signed in.
//
// This is deliberately NOT lib/supabase/server.ts's cookie-aware client:
// that one calls next/headers' cookies(), which only works inside an
// actual request. lib/content.ts's queries also run from
// generateStaticParams at build time — no request, no cookies — so using
// the cookie-aware client there fails outright ("used cookies() inside
// generateStaticParams"). Reach for lib/supabase/server.ts instead of this
// one for anything that genuinely needs the signed-in user's session
// (auth-gated reads/writes, e.g. an editor previewing an unpublished
// draft) — this client always reads as the anon role.

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
