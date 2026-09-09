'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Requests a password-recovery email. Clicking the emailed link lands on
// /auth/callback?redirect=/account-settings -- that route already
// exchanges the code for a real session (same path Google OAuth uses),
// and account-settings already has a "Change Password" form. So there's
// no separate "set your new password" page to build here: the recovery
// link signs the visitor in for real, and they just use the password
// field that's already there.
export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('redirect', '/account-settings')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.toString(),
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-slate-600 bg-soft-gold/40 border-l-4 border-gold p-4">
        If an account exists for <strong>{email}</strong>, a password reset link is on its way.
        Check your inbox — the link signs you in and takes you straight to where you can set a new
        password.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Reset Link'}
      </button>
      <p className="text-sm text-slate-500 text-center">
        <Link href="/sign-in" className="text-ocean-blue hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </form>
  )
}
