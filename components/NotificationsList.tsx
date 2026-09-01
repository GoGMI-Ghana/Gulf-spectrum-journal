'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Newspaper, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'

type NotificationType = 'new_issue' | 'new_article_in_topic'

interface NotificationRow {
  id: number
  type: NotificationType
  created_at: string
  read_at: string | null
  article: { slug: string; title: string } | null
  issue: { slug: string; theme: string; number: number } | null
}

// PostgREST infers embedded many-to-one relations as arrays without
// generated DB types (same situation as bookmarks' article embed) — this
// unwraps either shape rather than fighting the inference.
function one<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NotificationsList() {
  const { user, authLoading, markNotificationsRead } = useAccount()
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  // Same pattern as AccountContext/ProfileForm: whose data this is, not a
  // separate setLoading(true) at the top of the effect.
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('id, type, created_at, read_at, article:articles(slug, title), issue:issues(slug, theme, number)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load notifications', error)
          setNotifications([])
        } else {
          setNotifications(
            (data ?? []).map((row) => ({
              id: row.id,
              type: row.type as NotificationType,
              created_at: row.created_at,
              read_at: row.read_at,
              article: one(row.article as NotificationRow['article'] | NotificationRow['article'][] | null),
              issue: one(row.issue as NotificationRow['issue'] | NotificationRow['issue'][] | null),
            }))
          )
        }
        setLoadedForUserId(user.id)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const loading = Boolean(user) && loadedForUserId !== user?.id
  const unread = notifications.filter((n) => !n.read_at)

  async function handleMarkAllRead() {
    const ids = unread.map((n) => n.id)
    if (ids.length === 0) return
    setNotifications((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })))
    await markNotificationsRead(ids)
  }

  async function handleMarkOneRead(id: number) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)))
    await markNotificationsRead([id])
  }

  if (authLoading || loading) {
    return <p className="text-slate-500 text-sm">Loading your notifications…</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href="/sign-in?redirect=/notifications" className="text-ocean-blue hover:underline">
          Sign in
        </Link>{' '}
        to see your notifications.
      </p>
    )
  }

  if (notifications.length === 0) {
    return (
      <p className="text-slate-600">
        No notifications yet. You&apos;ll see one here when a new issue is published, or when a new
        article appears in a topic you&apos;ve bookmarked from.
      </p>
    )
  }

  return (
    <div>
      {unread.length > 0 && (
        <div className="flex justify-end mb-4">
          <button onClick={handleMarkAllRead} className="text-sm text-ocean-blue hover:underline">
            Mark all as read
          </button>
        </div>
      )}
      <ul className="divide-y divide-slate-200 border-t border-b border-slate-200">
        {notifications.map((n) => {
          const isUnread = !n.read_at
          const href = n.type === 'new_issue' && n.issue ? `/issues/${n.issue.slug}` : n.article ? `/articles/${n.article.slug}` : null
          const label =
            n.type === 'new_issue' && n.issue
              ? `New issue published: ${n.issue.theme}`
              : n.type === 'new_article_in_topic' && n.article
                ? `New article in a topic you follow: ${n.article.title}`
                : 'Update'
          const Icon = n.type === 'new_issue' ? Newspaper : FileText

          const content = (
            <div className={`flex items-start gap-3 px-1 py-4 ${isUnread ? 'bg-soft-gold/20' : ''}`}>
              <Icon size={16} className="text-ocean-blue shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isUnread ? 'font-semibold text-royal-blue' : 'text-slate-600'}`}>{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.created_at)}</p>
              </div>
              {isUnread && <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" aria-label="Unread" />}
            </div>
          )

          return (
            <li key={n.id}>
              {href ? (
                <Link href={href} onClick={() => isUnread && handleMarkOneRead(n.id)} className="block hover:bg-slate-50 transition-colors">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
