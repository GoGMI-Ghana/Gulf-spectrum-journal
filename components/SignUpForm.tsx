'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/context/I18nContext'
import { rich } from '@/lib/i18n/format'
import GoogleSignInButton from './GoogleSignInButton'

export default function SignUpForm() {
  const router = useRouter()
  const { t } = useI18n()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 uppercase tracking-wide">{t.common.or}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
            {t.common.fullName}
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            {t.common.email}
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
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            {t.common.password}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
          <p className="text-xs text-slate-400 mt-1">{t.signUp.minLength}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
        >
          {loading ? t.signUp.submitting : t.signUp.submit}
        </button>

        <p className="text-sm text-slate-500 text-center">
          {rich(t.signUp.haveAccount, {
            link: (
              <Link href="/sign-in" className="text-ocean-blue hover:underline">
                {t.common.signIn}
              </Link>
            ),
          })}
        </p>
        <p className="text-sm text-slate-500 text-center">
          {rich(t.signUp.noPassword, {
            link: (
              <Link href="/sign-in" className="text-ocean-blue hover:underline">
                {t.signUp.emailedCode}
              </Link>
            ),
          })}
        </p>
      </form>
    </div>
  )
}
