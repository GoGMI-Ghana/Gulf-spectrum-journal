import { seededNumber } from './seededNumber'
import type { Article } from './types'

// Deterministic placeholder engagement data (seeded per article/day), same
// approach as the existing Analytics table. Swap for real event tracking
// (see article_events in db/schema.sql) once the backend is connected.

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function formatAxisLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function lastNDates(n: number): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d)
  }
  return dates
}

export function dailyViews(slug: string, day: Date): number {
  return seededNumber(`${slug}-${dateKey(day)}-v`, 0, 40)
}

export function dailyDownloads(slug: string, day: Date): number {
  return seededNumber(`${slug}-${dateKey(day)}-d`, 0, 4)
}

export function allTimeViews(slug: string): number {
  return seededNumber(slug, 800, 5000)
}

export function allTimeDownloads(slug: string): number {
  return seededNumber(slug + '-dl', 80, 800)
}

export interface PeriodStats {
  views: number
  uniques: number
  downloads: number
  allTimeViews: number
  allTimeDownloads: number
}

export function periodStatsForArticle(article: Article, days: Date[]): PeriodStats {
  let views = 0
  let downloads = 0
  for (const day of days) {
    views += dailyViews(article.slug, day)
    downloads += dailyDownloads(article.slug, day)
  }
  const uniqueFraction = seededNumber(article.slug + '-uniq', 55, 90) / 100
  return {
    views,
    uniques: Math.round(views * uniqueFraction),
    downloads,
    allTimeViews: allTimeViews(article.slug),
    allTimeDownloads: allTimeDownloads(article.slug),
  }
}

export interface DailySeriesPoint {
  label: string
  views: number
  downloads: number
}

export function buildDailySeries(articles: Article[], days: Date[]): DailySeriesPoint[] {
  return days.map((day) => {
    let views = 0
    let downloads = 0
    for (const article of articles) {
      views += dailyViews(article.slug, day)
      downloads += dailyDownloads(article.slug, day)
    }
    return { label: formatAxisLabel(day), views, downloads }
  })
}
