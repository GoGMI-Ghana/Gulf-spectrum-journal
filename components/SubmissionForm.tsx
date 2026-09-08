'use client'

import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

// Same pattern as ContactForm: a direct insert through the browser
// client, since RLS already allows anyone to submit a proposal
// ("anyone can submit an article proposal"). Editors triage these from
// /admin/submissions.
export default function SubmissionForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.from('submissions').insert({
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      abstract: abstract.trim() || null,
    })

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }

    e.currentTarget.reset()
    setName('')
    setEmail('')
    setTitle('')
    setAbstract('')
    setSubmitted(true)
  }

  return (
    <div className="border-l-4 border-gold p-6 sticky top-32 bg-white">
      <h3 className="kicker text-royal-blue mb-4">Start Your Submission</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-name">
            Full name
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
            Email
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
            Proposed article title
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
            Abstract (draft)
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
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          Thank you — your proposal has been sent to the editorial office for review.
        </p>
      )}
    </div>
  )
}
