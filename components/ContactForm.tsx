'use client'

import { useState, type FormEvent } from 'react'
import { useI18n } from '@/context/I18nContext'
import HoneypotField from './HoneypotField'

// Posts to /api/contact, which saves the message for /admin/messages and
// emails the editorial office that it arrived.
export default function ContactForm() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    setSubmitted(false)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message, website }),
    }).catch(() => null)

    setSubmitting(false)
    if (!res || !res.ok) {
      const body = res ? await res.json().catch(() => null) : null
      setError(body?.error || t.common.somethingWrong)
      return
    }

    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    setSubmitted(true)
  }

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <HoneypotField value={website} onChange={setWebsite} />
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-name">
              {t.contact.name}
            </label>
            <input
              id="c-name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-email">
              {t.common.email}
            </label>
            <input
              id="c-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-subject">
            {t.contact.subject}
          </label>
          <input
            id="c-subject"
            required
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-message">
            {t.contact.message}
          </label>
          <textarea
            id="c-message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 transition-colors tracking-wide disabled:opacity-60"
        >
          {submitting ? t.common.sending : t.contact.send}
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          {t.contact.thanks}
        </p>
      )}
    </div>
  )
}
