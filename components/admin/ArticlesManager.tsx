'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { FileDown, Fingerprint, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { refreshPublicSite } from '@/lib/refreshPublicSite'
import { AdminHeading, primaryButtonClass } from './AdminUI'

type Status = 'draft' | 'in_review' | 'published'

interface ArticleRow {
  id: string
  slug: string
  title: string
  status: Status
  updated_at: string
  issue_id: string | null
  doi: string | null
  issue: { theme: string } | { theme: string }[] | null
  topic: { label: string } | { label: string }[] | null
}

const TABS: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' },
]

const STATUS_STYLE: Record<Status, string> = {
  draft: 'text-slate-500 bg-slate-100 border-slate-200',
  in_review: 'text-amber-700 bg-amber-50 border-amber-200',
  published: 'text-emerald-700 bg-emerald-50 border-emerald-200',
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

// Reads the initial ?status= filter from the dashboard's deep links
// (e.g. /admin/articles?status=in_review). Only read once, on mount —
// this is a starting point for the tabs below, not a synced URL state.
function subscribe() {
  return () => {}
}
function getInitialStatusSnapshot(): string {
  return typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('status') ?? ''
}
function getServerSnapshot() {
  return ''
}

export default function ArticlesManager() {
  const initialStatus = useSyncExternalStore(subscribe, getInitialStatusSnapshot, getServerSnapshot)
  // Whichever tab was clicked, if any — null means "follow the URL's
  // ?status= param", so a dashboard deep link still works before the
  // reader clicks anything, without a setState-in-effect to sync it.
  const [manualTab, setManualTab] = useState<Status | 'all' | null>(null)
  const urlTab = initialStatus === 'draft' || initialStatus === 'in_review' || initialStatus === 'published' ? initialStatus : 'all'
  const tab = manualTab ?? urlTab
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loaded, setLoaded] = useState(false)

  function load() {
    const supabase = createClient()
    let query = supabase
      .from('articles')
      .select('id, slug, title, status, updated_at, issue_id, doi, issue:issues(theme), topic:topics(label)')
      .order('updated_at', { ascending: false })
    if (tab !== 'all') query = query.eq('status', tab)
    query.then(({ data, error }) => {
      if (error) console.error('Failed to load articles', error)
      else setArticles(data as unknown as ArticleRow[])
      setLoaded(true)
    })
  }

  useEffect(load, [tab])

  // DOI registration for an online-first article, step 2: after Crossref
  // has accepted the uploaded file (see app/api/admin/articles/[id]/crossref),
  // put the DOI on the article so the site links it. Articles in an issue
  // are registered from the Issues page instead.
  async function saveDoi(a: ArticleRow) {
    const plan = await fetch(`/api/admin/articles/${a.id}/crossref`).then((r) => r.json()).catch(() => null)
    if (!plan || plan.error) {
      alert(plan?.error ?? 'Could not load the DOI for this article.')
      return
    }
    if (plan.saved) {
      alert('This article already has its DOI saved.')
      return
    }
    const ok = confirm(
      `Only do this after Crossref has confirmed the upload was successful.\n\nThis DOI will be saved and shown on the article:\n\n${plan.doi}`
    )
    if (!ok) return
    const res = await fetch(`/api/admin/articles/${a.id}/crossref`, { method: 'POST' })
    const body = await res.json().catch(() => null)
    alert(res.ok ? (body?.saved ? 'DOI saved.' : 'Nothing to save.') : body?.error ?? 'The DOI could not be saved.')
    load()
  }

  async function handleDelete(a: ArticleRow) {
    if (!confirm(`Delete "${a.title}"? This can't be undone.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('articles').delete().eq('id', a.id)
    if (error) {
      alert(`Couldn't delete: ${error.message}`)
      return
    }
    await refreshPublicSite()
    load()
  }

  return (
    <div>
      <AdminHeading
        title="Articles"
        description="Draft, review, and publish articles."
        action={
          <Link href="/admin/articles/new" className={primaryButtonClass}>
            + New Article
          </Link>
        }
      />

      <div className="flex gap-1 mb-5 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setManualTab(t.value)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.value ? 'border-royal-blue text-royal-blue' : 'border-transparent text-slate-500 hover:text-royal-blue'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : articles.length === 0 ? (
        <p className="text-slate-500 text-sm">No articles here yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {articles.map((a) => {
            const issue = one(a.issue)
            const topic = one(a.topic)
            return (
              <div key={a.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-royal-blue truncate">
                    {a.title}{' '}
                    <span className={`ml-1 text-[10px] font-normal px-1.5 py-0.5 align-middle border ${STATUS_STYLE[a.status]}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {issue?.theme ?? 'Online first'}
                    {topic ? ` · ${topic.label}` : ''}
                  </p>
                  {a.status === 'published' && (
                    <Link href={`/articles/${a.slug}`} className="text-xs text-ocean-blue hover:underline">
                      View live →
                    </Link>
                  )}
                  {a.status === 'published' && !a.issue_id && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {/* DOI registration, step 1: the file to upload at Crossref. */}
                      <a href={`/api/admin/articles/${a.id}/crossref?format=xml`} className="flex items-center gap-1 text-xs text-ocean-blue hover:underline">
                        <FileDown size={12} /> Crossref file
                      </a>
                      {a.doi ? (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Fingerprint size={12} /> DOI {a.doi}
                        </span>
                      ) : (
                        <button onClick={() => saveDoi(a)} className="flex items-center gap-1 text-xs text-ocean-blue hover:underline">
                          <Fingerprint size={12} /> Save DOI (after Crossref accepts)
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/admin/articles/${a.id}`} className="text-slate-400 hover:text-royal-blue" aria-label="Edit">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => handleDelete(a)} className="text-slate-400 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
