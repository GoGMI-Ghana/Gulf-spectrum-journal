'use client'

import { useRef, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'
import { MANUSCRIPT_ACCEPT, MANUSCRIPT_BUCKET, MANUSCRIPT_MAX_BYTES, MANUSCRIPT_MAX_MB, manuscriptExtension } from '@/lib/manuscripts'
import HoneypotField from './HoneypotField'

// Posts to /api/submissions, which saves the proposal for
// /admin/submissions and emails the editorial office that it arrived.
//
// An attached manuscript is uploaded first, straight from the browser to
// private storage, through a one-time upload URL the site issues for it
// (see app/api/submissions/upload-url) — then the proposal is sent with a
// reference to that file.
export default function SubmissionForm() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Checked as soon as a file is chosen, so the author finds out before
  // filling in the rest and pressing Submit.
  function handleFileChange(chosen: File | null) {
    setError(null)
    if (chosen && !manuscriptExtension(chosen.name)) {
      setError(t.submissions.manuscriptWrongType)
      chosen = null
    } else if (chosen && chosen.size > MANUSCRIPT_MAX_BYTES) {
      setError(fmt(t.submissions.manuscriptTooLarge, { max: MANUSCRIPT_MAX_MB }))
      chosen = null
    }
    setFile(chosen)
    if (!chosen && fileInput.current) fileInput.current.value = ''
  }

  // Returns the stored file's path, or null after showing an error.
  async function uploadManuscript(manuscript: File): Promise<string | null> {
    const res = await fetch('/api/submissions/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: manuscript.name, size: manuscript.size, website }),
    }).catch(() => null)
    const ticket = res ? await res.json().catch(() => null) : null
    if (!res || !res.ok || !ticket?.path) {
      setError(ticket?.error || t.submissions.manuscriptUploadFailed)
      return null
    }

    const { error: uploadError } = await createClient()
      .storage.from(MANUSCRIPT_BUCKET)
      .uploadToSignedUrl(ticket.path, ticket.token, manuscript, { contentType: ticket.contentType })
    if (uploadError) {
      console.error('Manuscript upload failed', uploadError)
      setError(t.submissions.manuscriptUploadFailed)
      return null
    }
    return ticket.path as string
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSubmitted(false)

    let manuscriptPath = ''
    if (file) {
      setUploading(true)
      const path = await uploadManuscript(file)
      setUploading(false)
      if (!path) {
        setSubmitting(false)
        return
      }
      manuscriptPath = path
    }

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, title, abstract, manuscriptPath, manuscriptName: file?.name ?? '', website }),
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
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
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
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-manuscript">
            {t.submissions.manuscriptLabel}
          </label>
          <input
            id="sub-manuscript"
            ref={fileInput}
            type="file"
            accept={MANUSCRIPT_ACCEPT}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-slate-700 hover:file:border-royal-blue file:cursor-pointer"
          />
          <p className="text-xs text-slate-400 mt-1">{fmt(t.submissions.manuscriptHint, { max: MANUSCRIPT_MAX_MB })}</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 transition-colors tracking-wide disabled:opacity-60"
        >
          {uploading ? t.submissions.manuscriptUploading : submitting ? t.common.submitting : t.submissions.submit}
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
