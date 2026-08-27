'use client'

import { createClient } from '@/lib/supabase/client'

// Renders regardless of whether Google sign-in is actually configured on
// the backend yet (see gulf-spectrum-backend/self-hosting — the Google
// provider is wired into docker-compose.yml but commented out until a
// real Client ID/Secret from Google Cloud Console are set). Clicking it
// before that's done just surfaces GoTrue's "provider is not enabled"
// error via the normal error state, rather than hiding the button — the
// button existing isn't a promise it works yet, but that's an honest
// failure mode, not a broken one.
export default function GoogleSignInButton({ redirectTo }: { redirectTo?: string }) {
  async function handleClick() {
    const supabase = createClient()
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) callbackUrl.searchParams.set('redirect', redirectTo)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl.toString() },
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2.5 border border-slate-300 hover:border-royal-blue text-slate-700 font-medium px-4 py-2.5 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.36 0-4.36-1.59-5.07-3.73H.9v2.33A9 9 0 0 0 9 18z" />
        <path fill="#FBBC05" d="M3.93 10.69A5.4 5.4 0 0 1 3.65 9c0-.59.1-1.16.28-1.69V4.98H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.02z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.98l3.03 2.33C4.64 5.17 6.64 3.58 9 3.58z" />
      </svg>
      Continue with Google
    </button>
  )
}
