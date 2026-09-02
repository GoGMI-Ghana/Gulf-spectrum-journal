'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading, ErrorBanner, Field, inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

interface TopicRow {
  id: string
  slug: string
  label: string
  description: string
}

const EMPTY = { slug: '', label: '', description: '' }

export default function TopicsManager() {
  const [topics, setTopics] = useState<TopicRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    const supabase = createClient()
    supabase
      .from('topics')
      .select('id, slug, label, description')
      .order('label')
      .then(({ data, error: err }) => {
        if (err) {
          console.error('Failed to load topics', err)
        } else {
          setTopics(data as TopicRow[])
        }
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

  function startEdit(t: TopicRow) {
    setEditingId(t.id)
    setForm({ slug: t.slug, label: t.label, description: t.description })
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = { slug: form.slug.trim(), label: form.label.trim(), description: form.description.trim() }

    const { error: err } = editingId
      ? await supabase.from('topics').update(payload).eq('id', editingId)
      : await supabase.from('topics').insert(payload)

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(t: TopicRow) {
    if (!confirm(`Delete the topic "${t.label}"? Articles already assigned to it will need a new topic.`)) return
    const supabase = createClient()
    const { error: err } = await supabase.from('topics').delete().eq('id', t.id)
    if (err) {
      alert(`Couldn't delete: ${err.message}`)
      return
    }
    load()
  }

  return (
    <div>
      <AdminHeading
        title="Topics"
        description="The subject areas articles are filed under."
        action={
          <button onClick={startCreate} className={primaryButtonClass}>
            + New Topic
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-slate-200 p-5 mb-6 space-y-4 max-w-xl">
          <ErrorBanner message={error} />
          <Field label="Slug" hint="Used in URLs, e.g. /topics/blue-economy — lowercase, hyphens only.">
            <input
              required
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="Label">
            <input
              required
              className={inputClass}
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <textarea
              required
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create topic'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : topics.length === 0 ? (
        <p className="text-slate-500 text-sm">No topics yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {topics.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-royal-blue">{t.label}</p>
                <p className="text-xs text-slate-400 font-mono">{t.slug}</p>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => startEdit(t)} className="text-slate-400 hover:text-royal-blue" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(t)} className="text-slate-400 hover:text-red-600" aria-label="Delete">
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
