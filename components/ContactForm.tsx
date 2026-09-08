'use client'

import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

// Real insert straight through the browser client — RLS already allows
// anyone to insert a contact message ("anyone can send a contact
// message"), so no Route Handler is needed for the write itself, same
// as every other anon-writable table in this app (donations, bookmarks
// aside). Reading these back is editor-only; see /admin/messages.
export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }

    e.currentTarget.reset()
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
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-name">
              Name
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
              Email
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
            Subject
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
            Message
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
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          Thank you — your message has been sent to the editorial office.
        </p>
      )}
    </div>
  )
}
