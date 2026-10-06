'use client'

import { useState, type FormEvent } from 'react'
import { useI18n } from '@/context/I18nContext'
import HoneypotField from './HoneypotField'

// Posts to /api/submissions, which saves the proposal for
// /admin/submissions and emails the editorial office that it arrived.
export default function SubmissionForm() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    setSubmitted(false)

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, title, abstract, website }),
    }).catch(() => null)

    setSubmitting(false)
    if (!res || !res.ok) {
      const body = res ? await res.json().catch(() => null) : null
      setError(body?.error || t.common.somethingWrong)
      return
    }

    setName('')
    setEmail('')
    setTitle('')
    setAbstract('')
    setSubmitted(true)
  }

  return (
    <div className="border-l-4 border-gold p-6 sticky top-32 bg-white">
      <h3 className="kicker text-royal-blue mb-4">{t.submissions.formHeading}</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <HoneypotField value={website} onChange={setWebsite} />
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-name">
            {t.common.fullName}
          </label>
          <input
            id="sub-name"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-email">
            {t.common.email}
          </label>
          <input
            id="sub-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-title">
            {t.submissions.titleLabel}
          </label>
          <input
            id="sub-title"
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-abstract">
            {t.submissions.abstractLabel}
          </label>
          <textarea
            id="sub-abstract"
            rows={4}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 transition-colors tracking-wide disabled:opacity-60"
        >
          {submitting ? t.common.submitting : t.submissions.submit}
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          {t.submissions.thanks}
        </p>
      )}
    </div>
  )
}
