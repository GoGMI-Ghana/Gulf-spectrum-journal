'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading, ErrorBanner, Field, inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

interface BoardMember {
  name: string
  role: string
}

interface IssueRow {
  id: string
  slug: string
  number: number
  volume: number
  year: number
  cover_image: string | null
  status: 'draft' | 'published'
  theme: string
  published_date: string | null
  about_this_volume: string | null
  editorial_board: BoardMember[]
}

const EMPTY = {
  slug: '',
  number: '',
  volume: '',
  year: String(new Date().getFullYear()),
  cover_image: '',
  status: 'draft' as 'draft' | 'published',
  theme: '',
  published_date: '',
  about_this_volume: '',
  editorial_board: [] as BoardMember[],
}

function EditorialBoardEditor({ value, onChange }: { value: BoardMember[]; onChange: (v: BoardMember[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Name"
            value={m.name}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
          />
          <input
            className={inputClass}
            placeholder="Role"
            value={m.role}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
          />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600 px-2 shrink-0" aria-label="Remove">
            <X size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { name: '', role: '' }])} className="flex items-center gap-1 text-sm text-ocean-blue hover:underline">
        <Plus size={14} /> Add board member
      </button>
    </div>
  )
}

export default function IssuesManager() {
  const [issues, setIssues] = useState<IssueRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    const supabase = createClient()
    supabase
      .from('issues')
      .select('id, slug, number, volume, year, cover_image, status, theme, published_date, about_this_volume, editorial_board')
      .order('number', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) console.error('Failed to load issues', err)
        else setIssues(data as IssueRow[])
        setLoaded(true)
      })
  }

  useEffect(load, [])

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY)
    setError(null)
    setShowForm(true)
  }

  function startEdit(iss: IssueRow) {
    setEditingId(iss.id)
    setForm({
      slug: iss.slug,
      number: String(iss.number),
      volume: String(iss.volume),
      year: String(iss.year),
      cover_image: iss.cover_image ?? '',
      status: iss.status,
      theme: iss.theme,
      published_date: iss.published_date ?? '',
      about_this_volume: iss.about_this_volume ?? '',
      editorial_board: iss.editorial_board ?? [],
    })
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = {
      slug: form.slug.trim(),
      number: Number(form.number),
      volume: Number(form.volume),
      year: Number(form.year),
      cover_image: form.cover_image.trim() || null,
      status: form.status,
      theme: form.theme.trim(),
      published_date: form.published_date.trim() || null,
      about_this_volume: form.about_this_volume.trim() || null,
      editorial_board: form.editorial_board.filter((m) => m.name.trim() || m.role.trim()),
    }

    const { error: err } = editingId
      ? await supabase.from('issues').update(payload).eq('id', editingId)
      : await supabase.from('issues').insert(payload)

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(iss: IssueRow) {
    if (!confirm(`Delete issue "${iss.theme}"? This fails if it still has articles — reassign or delete those first.`)) return
    const supabase = createClient()
    const { error: err } = await supabase.from('issues').delete().eq('id', iss.id)
    if (err) {
      alert(`Couldn't delete: ${err.message}`)
      return
    }
    load()
  }

  return (
    <div>
      <AdminHeading
        title="Issues"
        description="Volumes of the journal. Only 'Published' issues are visible to readers."
        action={
          <button onClick={startCreate} className={primaryButtonClass}>
            + New Issue
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-slate-200 p-5 mb-6 space-y-4 max-w-2xl">
          <ErrorBanner message={error} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Issue #">
              <input required type="number" className={inputClass} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
            </Field>
            <Field label="Volume">
              <input required type="number" className={inputClass} value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} />
            </Field>
            <Field label="Year">
              <input required type="number" className={inputClass} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" hint="/issues/this-slug">
              <input required className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              >
                <option value="draft">Draft (hidden from readers)</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>
          <Field label="Theme">
            <input required className={inputClass} value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
          </Field>
          <Field label="Published date (display text)" hint='e.g. "November 2025" — shown as-is, not parsed.'>
            <input className={inputClass} value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
          </Field>
          <Field label="Cover image URL">
            <input className={inputClass} value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
          </Field>
          <Field label="About this volume">
            <textarea rows={4} className={inputClass} value={form.about_this_volume} onChange={(e) => setForm({ ...form, about_this_volume: e.target.value })} />
          </Field>
          <Field label="Editorial board for this issue">
            <EditorialBoardEditor value={form.editorial_board} onChange={(v) => setForm({ ...form, editorial_board: v })} />
          </Field>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create issue'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : issues.length === 0 ? (
        <p className="text-slate-500 text-sm">No issues yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {issues.map((iss) => (
            <div key={iss.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-royal-blue">
                  Vol. {iss.volume}, No. {iss.number} — {iss.theme}
                  <span
                    className={`ml-2 text-[10px] font-normal px-1.5 py-0.5 align-middle ${
                      iss.status === 'published' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-500 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {iss.status}
                  </span>
                </p>
                <p className="text-xs text-slate-400 font-mono">{iss.slug}</p>
                {iss.status === 'published' && (
                  <Link href={`/issues/${iss.slug}`} className="text-xs text-ocean-blue hover:underline">
                    View live →
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(iss)} className="text-slate-400 hover:text-royal-blue" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(iss)} className="text-slate-400 hover:text-red-600" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
