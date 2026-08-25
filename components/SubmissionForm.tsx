'use client'

import { useState } from 'react'

export default function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.currentTarget.reset()
    setSubmitted(true)
  }

  return (
    <div className="border-l-4 border-gold p-6 sticky top-32 bg-white">
      <h3 className="kicker text-royal-blue mb-4">Start Your Submission</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-name">
            Full name
          </label>
          <input
            id="sub-name"
            required
            type="text"
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
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 transition-colors tracking-wide"
        >
          Submit for Review
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          Thank you — this is a design prototype, so no submission was sent. The
          editorial office will follow up once the form is connected.
        </p>
      )}
    </div>
  )
}
