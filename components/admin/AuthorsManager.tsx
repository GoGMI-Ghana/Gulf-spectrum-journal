'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading, ErrorBanner, Field, inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

interface AuthorRow {
  id: string
  slug: string
  name: string
  credentials: string | null
  affiliation: string | null
  bio: string | null
  photo_url: string | null
  user_id: string | null
}

const EMPTY = { slug: '', name: '', credentials: '', affiliation: '', bio: '', photo_url: '', user_id: '' }

export default function AuthorsManager() {
  const [authors, setAuthors] = useState<AuthorRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    const supabase = createClient()
    supabase
      .from('authors')
      .select('id, slug, name, credentials, affiliation, bio, photo_url, user_id')
      .order('name')
      .then(({ data, error: err }) => {
        if (err) console.error('Failed to load authors', err)
        else setAuthors(data as AuthorRow[])
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

  function startEdit(a: AuthorRow) {
    setEditingId(a.id)
    setForm({
      slug: a.slug,
      name: a.name,
      credentials: a.credentials ?? '',
      affiliation: a.affiliation ?? '',
      bio: a.bio ?? '',
      photo_url: a.photo_url ?? '',
      user_id: a.user_id ?? '',
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
      name: form.name.trim(),
      credentials: form.credentials.trim() || null,
      affiliation: form.affiliation.trim() || null,
      bio: form.bio.trim() || null,
      photo_url: form.photo_url.trim() || null,
      user_id: form.user_id.trim() || null,
    }

    const { error: err } = editingId
      ? await supabase.from('authors').update(payload).eq('id', editingId)
      : await supabase.from('authors').insert(payload)

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(a: AuthorRow) {
    if (!confirm(`Delete the author "${a.name}"? This fails if they're still credited on any article.`)) return
    const supabase = createClient()
    const { error: err } = await supabase.from('authors').delete().eq('id', a.id)
    if (err) {
      alert(`Couldn't delete: ${err.message}`)
      return
    }
    load()
  }

  return (
    <div>
      <AdminHeading
        title="Authors"
        description="Journal contributors — separate from reader accounts, unless linked."
        action={
          <button onClick={startCreate} className={primaryButtonClass}>
            + New Author
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-slate-200 p-5 mb-6 space-y-4 max-w-xl">
          <ErrorBanner message={error} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Slug" hint="/authors/this-slug">
              <input required className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
          </div>
          <Field label="Credentials" hint='e.g. "PhD, Maritime Law"'>
            <input className={inputClass} value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })} />
          </Field>
          <Field label="Affiliation">
            <input className={inputClass} value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} />
          </Field>
          <Field label="Bio">
            <textarea rows={4} className={inputClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </Field>
          <Field label="Photo URL" hint="A hosted image URL — there's no upload yet, so this must already exist somewhere.">
            <input className={inputClass} value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
          </Field>
          <Field label="Linked account ID (optional)" hint="Connects this author page to a reader account, from Users & Roles.">
            <input className={inputClass} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} />
          </Field>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create author'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : authors.length === 0 ? (
        <p className="text-slate-500 text-sm">No authors yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {authors.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="flex items-start gap-3 min-w-0">
                {a.photo_url ? (
                  // Plain <img>, not next/image: editors can type any hosted
                  // URL here, and next/image would reject anything outside
                  // next.config's (currently empty) remotePatterns allow-list.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.photo_url} alt="" className="w-9 h-9 object-cover shrink-0 rounded-full" />
                ) : (
                  <div className="w-9 h-9 shrink-0 rounded-full bg-soft-gold" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-royal-blue">
                    {a.name}
                    {a.user_id && <span className="ml-2 text-[10px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 align-middle">Linked</span>}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">{a.slug}</p>
                  {a.affiliation && <p className="text-sm text-slate-600 mt-0.5">{a.affiliation}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(a)} className="text-slate-400 hover:text-royal-blue" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(a)} className="text-slate-400 hover:text-red-600" aria-label="Delete">
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
