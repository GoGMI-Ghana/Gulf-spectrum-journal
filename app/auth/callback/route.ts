// OAuth callback (Google, and any other provider added later). The flow:
// 1. The sign-in/sign-up form calls supabase.auth.signInWithOAuth(),
//    which sends the browser to Google's consent screen.
// 2. Google redirects to GoTrue's OWN callback
//    (https://api.gulfspectrumjournal.com/auth/v1/callback —
//    GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI on the backend, registered with
//    Google as the authorized redirect URI, not this route).
// 3. GoTrue exchanges the code with Google, creates/updates the user,
//    then redirects the browser here (the redirectTo we passed in step 1)
//    with its own `?code=...`. This route does the SECOND exchange —
//    trading that code for a session — using the cookie-aware server
//    client, so the resulting cookies land on gulfspectrumjournal.com,
//    not on the Supabase instance's own domain.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const next = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=oauth`)
}
