'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GoogleSignInButton from './GoogleSignInButton'
import EmailOtpForm from './EmailOtpForm'

export default function SignInForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <GoogleSignInButton redirectTo={redirectTo} />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 uppercase tracking-wide">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            mode === 'password' ? 'border-royal-blue text-royal-blue' : 'border-transparent text-slate-500 hover:text-royal-blue'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode('otp')}
          className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            mode === 'otp' ? 'border-royal-blue text-royal-blue' : 'border-transparent text-slate-500 hover:text-royal-blue'
          }`}
        >
          Email code
        </button>
      </div>

      {mode === 'otp' ? (
        <EmailOtpForm redirectTo={redirectTo} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link href="/reset-password" className="text-xs text-ocean-blue hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      )}

      <p className="text-sm text-slate-500 text-center">
        New here?{' '}
        <Link href="/sign-up" className="text-ocean-blue hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
