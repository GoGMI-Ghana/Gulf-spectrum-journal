'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading, inputClass } from './AdminUI'

type Status = 'new' | 'in_review' | 'accepted' | 'declined'

interface SubmissionRow {
  id: string
  name: string
  email: string
  title: string
  abstract: string | null
  status: Status
  editor_notes: string | null
  created_at: string
}

const STATUS_STYLE: Record<Status, string> = {
  new: 'text-amber-700 bg-amber-50 border-amber-200',
  in_review: 'text-ocean-blue bg-blue-50 border-blue-200',
  accepted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  declined: 'text-red-700 bg-red-50 border-red-200',
}

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})

  function load() {
    const supabase = createClient()
    supabase
      .from('submissions')
      .select('id, name, email, title, abstract, status, editor_notes, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Failed to load submissions', error)
        else setSubmissions(data as SubmissionRow[])
        setLoaded(true)
      })
  }

  useEffect(load, [])

  async function handleStatusChange(s: SubmissionRow, status: Status) {
    const supabase = createClient()
    setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, status } : x)))
    const {
      data: { user },
    } = await supabase.auth.getUser()
    await supabase
      .from('submissions')
      .update({ status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
      .eq('id', s.id)
  }

  async function handleSaveNotes(s: SubmissionRow) {
    const supabase = createClient()
    const notes = notesDraft[s.id] ?? s.editor_notes ?? ''
    setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, editor_notes: notes } : x)))
    await supabase.from('submissions').update({ editor_notes: notes }).eq('id', s.id)
  }

  return (
    <div>
      <AdminHeading title="Submissions" description="Article proposals from the Submission Guidelines page." />

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : submissions.length === 0 ? (
        <p className="text-slate-500 text-sm">No submissions yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {submissions.map((s) => {
            const isOpen = openId === s.id
            return (
              <div key={s.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="w-full text-left flex items-start justify-between gap-4 px-4 py-3 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-royal-blue truncate">
                      {s.title} <span className={`ml-1 text-[10px] font-normal px-1.5 py-0.5 align-middle border ${STATUS_STYLE[s.status]}`}>{s.status.replace('_', ' ')}</span>
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {s.name} · {s.email}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {s.abstract && <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-200 p-3">{s.abstract}</p>}
                    <a href={`mailto:${s.email}`} className="inline-block text-sm text-ocean-blue hover:underline">
                      Email {s.name} →
                    </a>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Status:</span>
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(s, e.target.value as Status)}
                        className="border border-slate-300 px-2 py-1 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="in_review">In review</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Internal notes (not visible to the submitter)"
                        value={notesDraft[s.id] ?? s.editor_notes ?? ''}
                        onChange={(e) => setNotesDraft((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        className={inputClass}
                      />
                      <button onClick={() => handleSaveNotes(s)} className="mt-1.5 text-xs text-ocean-blue hover:underline">
                        Save notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
