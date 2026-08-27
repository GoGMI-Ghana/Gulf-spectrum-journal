// Real analytics reads — article_stats (all-time) and article_daily_stats
// (day-bucketed, last 60 days) from the self-hosted Supabase instance.
// Both are aggregate views over article_events, granted to anon/
// authenticated even though the raw event table itself is editor-only
// (see gulf-spectrum-backend's migrations) — the app never reads
// individual events, just these two aggregates.
//
// Keyed by article_id (a UUID) rather than slug, since that's what the
// views themselves group by — app/analytics/page.tsx remaps to slug
// using the article list it already has.
//
// Uses the same plain, cookie-free client as lib/content.ts, for the same
// reason: this page is statically generated (with revalidate — see the
// page itself), so these queries can run at build time, where there's no
// request/cookie context to read.

import { cache } from 'react'
import { createClient } from './supabase/staticClient'

export interface ArticleStat {
  views: number
  downloads: number
}

export const getArticleStatsById = cache(async (): Promise<Record<string, ArticleStat>> => {
  const supabase = createClient()
  const { data, error } = await supabase.from('article_stats').select('article_id, views, downloads')
  if (error) throw error
  return Object.fromEntries(
    (data ?? []).map((r) => [r.article_id, { views: r.views ?? 0, downloads: r.downloads ?? 0 }])
  )
})

// Covers the dashboard's 30-day and 60-day toggle from a single fetch —
// the client-side toggle just slices this, no extra round trip per click.
const DAILY_STATS_WINDOW_DAYS = 60

export const getArticleDailyStatsById = cache(async (): Promise<Record<string, Record<string, ArticleStat>>> => {
  const supabase = createClient()
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  since.setDate(since.getDate() - (DAILY_STATS_WINDOW_DAYS - 1))
  const sinceStr = since.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('article_daily_stats')
    .select('article_id, day, views, downloads')
    .gte('day', sinceStr)
  if (error) throw error

  const result: Record<string, Record<string, ArticleStat>> = {}
  for (const row of data ?? []) {
    const byDay = (result[row.article_id] ??= {})
    byDay[row.day] = { views: row.views ?? 0, downloads: row.downloads ?? 0 }
  }
  return result
})
