'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileEdit, CheckCircle2, BookOpen, Users, Tags, HeartHandshake } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading } from './AdminUI'

interface Stats {
  draftArticles: number
  inReviewArticles: number
  publishedArticles: number
  draftIssues: number
  publishedIssues: number
  authors: number
  topics: number
  pendingDonations: number
}

// head:true count queries — one round trip per number, no rows actually
// transferred. Run in parallel rather than sequentially awaited.
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    Promise.all([
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'in_review'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('issues').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('authors').select('id', { count: 'exact', head: true }),
      supabase.from('topics').select('id', { count: 'exact', head: true }),
      supabase.from('donations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then((results) => {
      if (cancelled) return
      const [draftArticles, inReviewArticles, publishedArticles, draftIssues, publishedIssues, authors, topics, pendingDonations] =
        results.map((r) => r.count ?? 0)
      setStats({
        draftArticles,
        inReviewArticles,
        publishedArticles,
        draftIssues,
        publishedIssues,
        authors,
        topics,
        pendingDonations,
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  const cards = stats
    ? [
        {
          label: 'Articles in review',
          value: stats.inReviewArticles,
          icon: FileEdit,
          href: '/admin/articles?status=in_review',
          note: `${stats.draftArticles} more still in draft`,
        },
        {
          label: 'Published articles',
          value: stats.publishedArticles,
          icon: CheckCircle2,
          href: '/admin/articles?status=published',
        },
        {
          label: 'Issues',
          value: stats.draftIssues + stats.publishedIssues,
          icon: BookOpen,
          href: '/admin/issues',
          note: `${stats.draftIssues} unpublished`,
        },
        { label: 'Authors', value: stats.authors, icon: Users, href: '/admin/authors' },
        { label: 'Topics', value: stats.topics, icon: Tags, href: '/admin/topics' },
        {
          label: 'Pending donations',
          value: stats.pendingDonations,
          icon: HeartHandshake,
          href: '/admin/donations',
          note: 'started but not yet confirmed by Paystack',
        },
      ]
    : []

  return (
    <div>
      <AdminHeading
        title="Editorial Dashboard"
        description="Manage articles, issues, authors, and topics for the journal."
      />

      {!stats ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="border border-slate-200 hover:border-royal-blue p-5 transition-colors group"
            >
              <c.icon size={18} className="text-ocean-blue mb-3" />
              <p className="text-2xl font-semibold text-royal-blue">{c.value}</p>
              <p className="text-sm text-slate-600">{c.label}</p>
              {c.note && <p className="text-xs text-slate-400 mt-1">{c.note}</p>}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/articles/new" className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-2.5 text-sm transition-colors">
          + New Article
        </Link>
        <Link href="/admin/issues" className="border border-slate-300 hover:bg-slate-50 font-medium px-5 py-2.5 text-sm transition-colors">
          + New Issue
        </Link>
      </div>
    </div>
  )
}
