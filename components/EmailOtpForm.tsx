'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/context/I18nContext'
import { rich } from '@/lib/i18n/format'

// Passwordless sign-in: request a 6-digit code by email, then verify it.
// signInWithOtp with shouldCreateUser (the default) means this covers
// sign-up too -- a brand new email just gets an account created
// automatically on successful verification, same as Google OAuth never
// asking "sign in or sign up", it just handles both. A new OTP account
// gets no full_name (there's no field to collect one in this flow) --
// same gap Google-created accounts can have if Google has no name on
// file, and same fix: set it later from the Profile page.
export default function EmailOtpForm({ redirectTo = '/' }: { redirectTo?: string }) {
  const router = useRouter()
  const { t } = useI18n()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setStep('verify')
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-4">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <p className="text-sm text-slate-600">
          {rich(t.otp.sentTo, { email: <strong>{email}</strong> })}
        </p>
        <div>
          <label htmlFor="otp-code" className="block text-sm font-medium text-slate-700 mb-1">
            {t.otp.code}
          </label>
          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full border border-slate-300 px-3 py-2 text-sm tracking-[0.3em] text-center focus:outline-none focus:border-royal-blue"
            placeholder="000000"
          />
        </div>
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
        >
          {loading ? t.otp.verifying : t.otp.verify}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep('request')
            setCode('')
            setError(null)
          }}
          className="w-full text-sm text-ocean-blue hover:underline"
        >
          {t.otp.different}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequestCode} className="space-y-4">
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
      <div>
        <label htmlFor="otp-email" className="block text-sm font-medium text-slate-700 mb-1">
          {t.common.email}
        </label>
        <input
          id="otp-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
        />
        <p className="text-xs text-slate-400 mt-1">
          {t.otp.hint}
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
      >
        {loading ? t.common.sending : t.otp.request}
      </button>
    </form>
  )
}
