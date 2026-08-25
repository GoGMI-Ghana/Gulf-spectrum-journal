'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.currentTarget.reset()
    setSubmitted(true)
  }

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-name">
              Name
            </label>
            <input
              id="c-name"
              required
              type="text"
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
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
          />
        </div>
        <button
          type="submit"
          className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 transition-colors tracking-wide"
        >
          Send Message
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
          Thank you — this is a design prototype, so no message was sent. Once
          connected, the editorial office will respond directly.
        </p>
      )}
    </div>
  )
}
