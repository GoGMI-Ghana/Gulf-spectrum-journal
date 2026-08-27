// Pure date utilities for the Analytics dashboard's 30/60-day range —
// no data generation here. Real numbers come from lib/analytics.ts
// (article_stats / article_daily_stats, backed by real article_events
// rows). This file used to also hold seeded placeholder view/download
// generators; those are gone now that real tracking exists — see
// components/ArticleViewLogger.tsx for where events actually get logged.
//
// Everything here is UTC-based on purpose, not local-time: the database
// buckets article_daily_stats by day in UTC (the self-hosted Postgres
// instance's session timezone), so dateKey()'s output has to line up
// with that or the join in AnalyticsDashboard silently returns nothing.
// A local-midnight version of this (what it used to be, back when it
// only fed a seeded fake-data generator with no real values to compare
// against) is wrong for any visitor not in UTC+0: local midnight
// converts to the previous UTC day for anyone east of Greenwich, so
// "today" never matches today's real row.

export interface DailySeriesPoint {
  label: string
  views: number
  downloads: number
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function formatAxisLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function lastNDates(n: number): Date[] {
  const now = new Date()
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const dates: Date[] = []
  for (let i = n - 1; i >= 0; i--) {
    dates.push(new Date(todayUTC - i * 24 * 60 * 60 * 1000))
  }
  return dates
}
