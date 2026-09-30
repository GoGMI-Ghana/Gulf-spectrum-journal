'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { fmt, formatDate, rich } from '@/lib/i18n/format'

type Status = 'pending' | 'approved' | 'declined'

interface ApplicationRow {
  id: string
  status: Status
  created_at: string
}

export default function EditorialBoardApplicationForm() {
  const { user, authLoading, boardTitle } = useAccount()
  const { locale, t } = useI18n()
  const [application, setApplication] = useState<ApplicationRow | null>(null)
  // Same "whose data is this" pattern as ProfileForm/AccountContext —
  // null result (no application yet) and "not loaded yet" both start
  // as `application === null`, so this tracks which is which.
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null)
  const [statement, setStatement] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('editorial_board_applications')
      .select('id, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) console.error('Failed to load application status', err)
        else setApplication(data as ApplicationRow | null)
        setLoadedForUserId(user.id)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('editorial_board_applications')
      .insert({ user_id: user.id, statement: statement.trim() })
      .select('id, status, created_at')
      .single()
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    setApplication(data as ApplicationRow)
    setJustSubmitted(true)
  }

  const loading = Boolean(user) && loadedForUserId !== user?.id

  if (authLoading || loading) {
    return <p className="text-slate-500 text-sm">{t.common.loading}</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        {rich(t.boardApply.signInPrompt, {
          link: (
            <Link href="/sign-in?redirect=/editorial-board/apply" className="text-ocean-blue hover:underline">
              {t.common.signIn}
            </Link>
          ),
        })}
      </p>
    )
  }

  if (boardTitle) {
    return (
      <p className="text-slate-600 bg-soft-gold/40 border-l-4 border-gold p-4">
        {rich(t.boardApply.alreadyMember, { title: <strong>{boardTitle}</strong> })}
      </p>
    )
  }

  if (application?.status === 'pending') {
    return (
      <p className="text-slate-600 bg-amber-50 border-l-4 border-amber-300 p-4">
        {fmt(t.boardApply.pending, {
          submitted: justSubmitted
            ? ''
            : fmt(t.boardApply.submittedOn, {
                date: formatDate(locale, application.created_at, { month: 'long', day: 'numeric', year: 'numeric' }),
              }),
        })}
      </p>
    )
  }

  return (
    <div>
      {application?.status === 'declined' && (
        <p className="text-slate-600 bg-slate-100 border-l-4 border-slate-300 p-4 mb-6">
          {t.boardApply.declined}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <div>
          <label htmlFor="statement" className="block text-sm font-medium text-slate-700 mb-1">
            {t.boardApply.statementLabel}
          </label>
          <textarea
            id="statement"
            required
            minLength={20}
            rows={6}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder={t.boardApply.statementPlaceholder}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
        >
          {submitting ? t.common.submitting : t.boardApply.submit}
        </button>
      </form>
    </div>
  )
}
