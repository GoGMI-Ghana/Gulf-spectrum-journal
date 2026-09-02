'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, ArrowDown, X, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading, ErrorBanner, Field, StringListEditor, inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

interface Section {
  heading: string
  body: string
}

interface OptionRow {
  id: string
  label: string
}

interface ArticleFormState {
  slug: string
  title: string
  issue_id: string
  topic_id: string
  status: 'draft' | 'in_review' | 'published'
  abstract: string
  keywords: string[]
  sections: Section[]
  conclusion: string
  references: string[]
  authorIds: string[] // in display order
}

const EMPTY: ArticleFormState = {
  slug: '',
  title: '',
  issue_id: '',
  topic_id: '',
  status: 'draft',
  abstract: '',
  keywords: [],
  sections: [],
  conclusion: '',
  references: [],
  authorIds: [],
}

function move<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir
  if (target < 0 || target >= arr.length) return arr
  const next = arr.slice()
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function SectionsEditor({ value, onChange }: { value: Section[]; onChange: (v: Section[]) => void }) {
  return (
    <div className="space-y-4">
      {value.map((s, i) => (
        <div key={i} className="border border-slate-200 p-3 space-y-2">
          <div className="flex gap-2 items-start">
            <input
              className={inputClass}
              placeholder="Section heading"
              value={s.heading}
              onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))}
            />
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => onChange(move(value, i, -1))} className="text-slate-400 hover:text-royal-blue p-1.5" aria-label="Move up">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => onChange(move(value, i, 1))} className="text-slate-400 hover:text-royal-blue p-1.5" aria-label="Move down">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600 p-1.5" aria-label="Remove section">
                <X size={14} />
              </button>
            </div>
          </div>
          <textarea
            rows={5}
            className={inputClass}
            placeholder="Section body"
            value={s.body}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))}
          />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { heading: '', body: '' }])} className="flex items-center gap-1 text-sm text-ocean-blue hover:underline">
        <Plus size={14} /> Add section
      </button>
    </div>
  )
}

function AuthorsEditor({
  authorIds,
  onChange,
  allAuthors,
}: {
  authorIds: string[]
  onChange: (v: string[]) => void
  allAuthors: OptionRow[]
}) {
  const [toAdd, setToAdd] = useState('')
  const available = allAuthors.filter((a) => !authorIds.includes(a.id))
  const byId = Object.fromEntries(allAuthors.map((a) => [a.id, a.label]))

  return (
    <div className="space-y-2">
      {authorIds.length === 0 && <p className="text-sm text-slate-400">No authors added yet.</p>}
      {authorIds.map((id, i) => (
        <div key={id} className="flex items-center gap-2 border border-slate-200 px-3 py-2">
          <span className="flex-1 text-sm text-slate-700 truncate">{byId[id] ?? '(unknown author)'}</span>
          <button type="button" onClick={() => onChange(move(authorIds, i, -1))} className="text-slate-400 hover:text-royal-blue p-1" aria-label="Move up">
            <ArrowUp size={14} />
          </button>
          <button type="button" onClick={() => onChange(move(authorIds, i, 1))} className="text-slate-400 hover:text-royal-blue p-1" aria-label="Move down">
            <ArrowDown size={14} />
          </button>
          <button type="button" onClick={() => onChange(authorIds.filter((x) => x !== id))} className="text-slate-400 hover:text-red-600 p-1" aria-label="Remove">
            <X size={14} />
          </button>
        </div>
      ))}
      {available.length > 0 && (
        <div className="flex gap-2 pt-1">
          <select className={inputClass} value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
            <option value="">Add an author…</option>
            {available.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!toAdd}
            onClick={() => {
              onChange([...authorIds, toAdd])
              setToAdd('')
            }}
            className={secondaryButtonClass}
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}

// articleId is undefined when creating; set when editing an existing row.
export default function ArticleForm({ articleId }: { articleId?: string }) {
  const router = useRouter()
  const [issues, setIssues] = useState<OptionRow[]>([])
  const [topics, setTopics] = useState<OptionRow[]>([])
  const [authors, setAuthors] = useState<OptionRow[]>([])
  const [form, setForm] = useState<ArticleFormState>(EMPTY)
  const [loaded, setLoaded] = useState(!articleId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    Promise.all([
      supabase.from('issues').select('id, volume, number, theme').order('number', { ascending: false }),
      supabase.from('topics').select('id, label').order('label'),
      supabase.from('authors').select('id, name').order('name'),
      articleId
        ? supabase
            .from('articles')
            .select(
              'slug, title, issue_id, topic_id, status, abstract, keywords, sections, conclusion, "references", article_authors(position, author_id)'
            )
            .eq('id', articleId)
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]).then(([issuesRes, topicsRes, authorsRes, articleRes]) => {
      if (cancelled) return
      setIssues((issuesRes.data ?? []).map((i) => ({ id: i.id, label: `Vol. ${i.volume}, No. ${i.number} — ${i.theme}` })))
      setTopics((topicsRes.data ?? []).map((t) => ({ id: t.id, label: t.label })))
      setAuthors((authorsRes.data ?? []).map((a) => ({ id: a.id, label: a.name })))

      if (articleId) {
        if (articleRes.error || !articleRes.data) {
          setError(articleRes.error?.message ?? 'Article not found.')
        } else {
          const row = articleRes.data as {
            slug: string
            title: string
            issue_id: string
            topic_id: string | null
            status: 'draft' | 'in_review' | 'published'
            abstract: string
            keywords: string[] | null
            sections: Section[] | null
            conclusion: string | null
            references: string[] | null
            article_authors: { position: number; author_id: string }[] | null
          }
          setForm({
            slug: row.slug,
            title: row.title,
            issue_id: row.issue_id,
            topic_id: row.topic_id ?? '',
            status: row.status,
            abstract: row.abstract,
            keywords: row.keywords ?? [],
            sections: row.sections ?? [],
            conclusion: row.conclusion ?? '',
            references: row.references ?? [],
            authorIds: (row.article_authors ?? [])
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((aa) => aa.author_id),
          })
        }
      }
      setLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [articleId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      issue_id: form.issue_id,
      topic_id: form.topic_id || null,
      status: form.status,
      abstract: form.abstract.trim(),
      keywords: form.keywords.map((k) => k.trim()).filter(Boolean),
      sections: form.sections.filter((s) => s.heading.trim() || s.body.trim()),
      conclusion: form.conclusion.trim() || null,
      references: form.references.map((r) => r.trim()).filter(Boolean),
    }

    if (!payload.issue_id) {
      setSaving(false)
      setError('Choose an issue for this article.')
      return
    }

    let id = articleId
    if (id) {
      const { error: err } = await supabase.from('articles').update(payload).eq('id', id)
      if (err) {
        setSaving(false)
        setError(err.message)
        return
      }
    } else {
      const { data, error: err } = await supabase.from('articles').insert(payload).select('id').single()
      if (err || !data) {
        setSaving(false)
        setError(err?.message ?? 'Failed to create article.')
        return
      }
      id = data.id
    }

    // Replace the article_authors rows wholesale rather than diffing —
    // simple and correct at the size this table runs at, and RLS lets
    // editors do both in one go ("editors manage article_authors").
    const { error: delErr } = await supabase.from('article_authors').delete().eq('article_id', id)
    if (delErr) {
      setSaving(false)
      setError(delErr.message)
      return
    }
    if (form.authorIds.length > 0) {
      const { error: insErr } = await supabase
        .from('article_authors')
        .insert(form.authorIds.map((author_id, position) => ({ article_id: id, author_id, position })))
      if (insErr) {
        setSaving(false)
        setError(insErr.message)
        return
      }
    }

    setSaving(false)
    router.push('/admin/articles')
  }

  if (!loaded) {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  return (
    <div>
      <AdminHeading title={articleId ? 'Edit Article' : 'New Article'} />
      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <ErrorBanner message={error} />

        <Field label="Title">
          <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Slug" hint="/articles/this-slug">
            <input required className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ArticleFormState['status'] })}>
              <option value="draft">Draft</option>
              <option value="in_review">In review</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Issue">
            <select required className={inputClass} value={form.issue_id} onChange={(e) => setForm({ ...form, issue_id: e.target.value })}>
              <option value="">Select an issue…</option>
              {issues.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Topic">
            <select className={inputClass} value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })}>
              <option value="">None</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Authors">
          <AuthorsEditor authorIds={form.authorIds} onChange={(v) => setForm({ ...form, authorIds: v })} allAuthors={authors} />
        </Field>

        <Field label="Abstract">
          <textarea required rows={4} className={inputClass} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} />
        </Field>

        <Field label="Keywords">
          <StringListEditor values={form.keywords} onChange={(v) => setForm({ ...form, keywords: v })} placeholder="Keyword" />
        </Field>

        <Field label="Sections">
          <SectionsEditor value={form.sections} onChange={(v) => setForm({ ...form, sections: v })} />
        </Field>

        <Field label="Conclusion">
          <textarea rows={4} className={inputClass} value={form.conclusion} onChange={(e) => setForm({ ...form, conclusion: e.target.value })} />
        </Field>

        <Field label="References">
          <StringListEditor values={form.references} onChange={(v) => setForm({ ...form, references: v })} placeholder="Citation" />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving ? 'Saving…' : articleId ? 'Save changes' : 'Create article'}
          </button>
          <button type="button" onClick={() => router.push('/admin/articles')} className={secondaryButtonClass}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
