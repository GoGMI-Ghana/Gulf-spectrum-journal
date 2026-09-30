'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import type { Article, Author, Topic } from '@/lib/types'
import type { ArticleStat } from '@/lib/analytics'
import { lastNDates, dateKey, formatAxisLabel, type DailySeriesPoint } from '@/lib/analyticsData'
import { useI18n } from '@/context/I18nContext'
import { fmt, formatNumber } from '@/lib/i18n/format'
import { intlLocales } from '@/lib/i18n/config'
import EngagementChart from './EngagementChart'

const TABS = ['overview', 'papers', 'topics', 'authors'] as const
type Tab = (typeof TABS)[number]

interface Props {
  articles: Article[]
  topics: Topic[]
  authors: Author[]
  topicByArticleSlug: Record<string, string> // slug -> topic label
  authorNamesByArticleSlug: Record<string, string[]> // slug -> author names
  statsBySlug: Record<string, ArticleStat> // all-time, per article
  dailyStatsBySlug: Record<string, Record<string, ArticleStat>> // slug -> "YYYY-MM-DD" -> stat, last 60 days
}

interface PeriodStat extends ArticleStat {
  article: Article
}

function periodStatForArticle(
  article: Article,
  days: Date[],
  dailyStatsBySlug: Props['dailyStatsBySlug']
): ArticleStat {
  const byDay = dailyStatsBySlug[article.slug]
  if (!byDay) return { views: 0, downloads: 0 }
  let views = 0
  let downloads = 0
  for (const day of days) {
    const stat = byDay[dateKey(day)]
    if (stat) {
      views += stat.views
      downloads += stat.downloads
    }
  }
  return { views, downloads }
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AnalyticsDashboard({
  articles,
  topics,
  authors,
  topicByArticleSlug,
  authorNamesByArticleSlug,
  statsBySlug,
  dailyStatsBySlug,
}: Props) {
  const { locale, t } = useI18n()
  const [tab, setTab] = useState<Tab>('overview')
  const tabLabels: Record<Tab, string> = {
    overview: t.analytics.tabOverview,
    papers: t.analytics.tabPapers,
    topics: t.analytics.tabTopics,
    authors: t.analytics.tabAuthors,
  }
  const [rangeDays, setRangeDays] = useState<30 | 60>(30)
  const periodViewsLabel = fmt(t.analytics.periodViews, { days: rangeDays })
  const periodDownloadsLabel = fmt(t.analytics.periodDownloads, { days: rangeDays })

  const days = useMemo(() => lastNDates(rangeDays), [rangeDays])

  const series: DailySeriesPoint[] = useMemo(
    () =>
      days.map((day) => {
        const key = dateKey(day)
        let views = 0
        let downloads = 0
        for (const article of articles) {
          const stat = dailyStatsBySlug[article.slug]?.[key]
          if (stat) {
            views += stat.views
            downloads += stat.downloads
          }
        }
        return { label: formatAxisLabel(day, intlLocales[locale]), views, downloads }
      }),
    [articles, days, dailyStatsBySlug, locale]
  )

  const perArticle: PeriodStat[] = useMemo(
    () => articles.map((article) => ({ article, ...periodStatForArticle(article, days, dailyStatsBySlug) })),
    [articles, days, dailyStatsBySlug]
  )

  const periodViewsTotal = perArticle.reduce((s, a) => s + a.views, 0)
  const periodDownloadsTotal = perArticle.reduce((s, a) => s + a.downloads, 0)

  const topicRows = topics.map((topic) => {
    const inTopic = perArticle.filter((a) => topicByArticleSlug[a.article.slug] === topic.slug)
    return {
      topic,
      articleCount: inTopic.length,
      views: inTopic.reduce((s, a) => s + a.views, 0),
      downloads: inTopic.reduce((s, a) => s + a.downloads, 0),
    }
  })

  const authorRows = authors
    .map((author) => {
      const theirArticles = perArticle.filter((a) => authorNamesByArticleSlug[a.article.slug]?.includes(author.name))
      return {
        author,
        articleCount: theirArticles.length,
        views: theirArticles.reduce((s, a) => s + a.views, 0),
        downloads: theirArticles.reduce((s, a) => s + a.downloads, 0),
      }
    })
    .filter((r) => r.articleCount > 0)

  function handleExport() {
    if (tab === 'topics') {
      downloadCsv(`topics-${rangeDays}d.csv`, [
        [t.analytics.colTopic, t.analytics.colArticles, periodViewsLabel, periodDownloadsLabel],
        ...topicRows.map((r) => [r.topic.label, r.articleCount, r.views, r.downloads]),
      ])
    } else if (tab === 'authors') {
      downloadCsv(`authors-${rangeDays}d.csv`, [
        [t.analytics.colAuthor, t.analytics.colArticles, periodViewsLabel, periodDownloadsLabel],
        ...authorRows.map((r) => [r.author.name, r.articleCount, r.views, r.downloads]),
      ])
    } else {
      downloadCsv(`articles-${rangeDays}d.csv`, [
        [t.analytics.colTitle, periodViewsLabel, periodDownloadsLabel, t.analytics.allTimeViews, t.analytics.allTimeDownloads],
        ...perArticle.map((a) => [
          a.article.title,
          a.views,
          a.downloads,
          statsBySlug[a.article.slug]?.views ?? 0,
          statsBySlug[a.article.slug]?.downloads ?? 0,
        ]),
      ])
    }
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-8">
        <nav className="flex flex-wrap gap-6">
          {TABS.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`text-sm font-medium py-3 border-b-2 -mb-px transition-colors ${
                tab === tabKey ? 'text-royal-blue border-gold' : 'text-slate-500 border-transparent hover:text-royal-blue'
              }`}
            >
              {tabLabels[tabKey]}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 pb-3">
          <div className="flex border border-slate-300">
            <button
              onClick={() => setRangeDays(30)}
              className={`px-3 py-1.5 text-sm ${rangeDays === 30 ? 'bg-royal-blue text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {t.analytics.days30}
            </button>
            <button
              onClick={() => setRangeDays(60)}
              className={`px-3 py-1.5 text-sm border-l border-slate-300 ${rangeDays === 60 ? 'bg-royal-blue text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {t.analytics.days60}
            </button>
          </div>
          <button
            onClick={handleExport}
            aria-label={t.analytics.exportCsv}
            title={t.analytics.exportCsv}
            className="border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 hover:text-royal-blue transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <div className="border border-slate-200 mb-8">
            <h3 className="text-sm font-semibold text-royal-blue px-5 py-3 border-b border-slate-200">
              {t.analytics.engagement}
            </h3>
            <div className="p-4">
              <EngagementChart data={series} label={t.analytics.chartLabel} />
            </div>
            <div className="grid grid-cols-2 border-t border-slate-200">
              <div className="px-5 py-4 border-r border-slate-200">
                <p className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" /> {periodViewsLabel}
                </p>
                <p className="numeral text-2xl font-bold text-royal-blue">{formatNumber(locale, periodViewsTotal)}</p>
              </div>
              <div className="px-5 py-4">
                <p className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-royal-blue inline-block" /> {periodDownloadsLabel}
                </p>
                <p className="numeral text-2xl font-bold text-royal-blue">{formatNumber(locale, periodDownloadsTotal)}</p>
              </div>
            </div>
          </div>
          <ArticlesTable rows={perArticle} statsBySlug={statsBySlug} rangeDays={rangeDays} />
        </>
      )}

      {tab === 'papers' && <ArticlesTable rows={perArticle} statsBySlug={statsBySlug} rangeDays={rangeDays} />}

      {tab === 'topics' && (
        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-4 font-medium">{t.analytics.colTopic}</th>
                <th className="py-3 px-4 font-medium text-right">{t.analytics.colArticles}</th>
                <th className="py-3 px-4 font-medium text-right">{periodViewsLabel}</th>
                <th className="py-3 px-4 font-medium text-right">{periodDownloadsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {topicRows.map((r) => (
                <tr key={r.topic.slug} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <Link href={`/topics/${r.topic.slug}`} className="text-royal-blue hover:text-ocean-blue font-medium">
                      {r.topic.label}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right numeral">{r.articleCount}</td>
                  <td className="py-3 px-4 text-right numeral">{formatNumber(locale, r.views)}</td>
                  <td className="py-3 px-4 text-right numeral">{formatNumber(locale, r.downloads)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'authors' && (
        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-4 font-medium">{t.analytics.colAuthor}</th>
                <th className="py-3 px-4 font-medium text-right">{t.analytics.colArticles}</th>
                <th className="py-3 px-4 font-medium text-right">{periodViewsLabel}</th>
                <th className="py-3 px-4 font-medium text-right">{periodDownloadsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {authorRows.map((r) => (
                <tr key={r.author.slug} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <Link href={`/authors/${r.author.slug}`} className="text-royal-blue hover:text-ocean-blue font-medium">
                      {r.author.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right numeral">{r.articleCount}</td>
                  <td className="py-3 px-4 text-right numeral">{formatNumber(locale, r.views)}</td>
                  <td className="py-3 px-4 text-right numeral">{formatNumber(locale, r.downloads)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4">
        {t.analytics.footnote}
      </p>
    </div>
  )
}

function ArticlesTable({
  rows,
  statsBySlug,
  rangeDays,
}: {
  rows: PeriodStat[]
  statsBySlug: Record<string, ArticleStat>
  rangeDays: number
}) {
  const { locale, t } = useI18n()
  const periodViewsLabel = fmt(t.analytics.periodViews, { days: rangeDays })
  const periodDownloadsLabel = fmt(t.analytics.periodDownloads, { days: rangeDays })
  return (
    <div className="overflow-x-auto border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200 bg-slate-50">
            <th className="py-3 px-4 font-medium">{t.analytics.colTitle}</th>
            <th className="py-3 px-4 font-medium text-right">{periodViewsLabel}</th>
            <th className="py-3 px-4 font-medium text-right">{periodDownloadsLabel}</th>
            <th className="py-3 px-4 font-medium text-right">{t.analytics.allTimeViews}</th>
            <th className="py-3 px-4 font-medium text-right">{t.analytics.allTimeDownloads}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ article, views, downloads }) => (
            <tr key={article.slug} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-4">
                <Link href={`/articles/${article.slug}`} className="text-royal-blue hover:text-ocean-blue font-medium">
                  {article.title}
                </Link>
              </td>
              <td className="py-3 px-4 text-right numeral">{views}</td>
              <td className="py-3 px-4 text-right numeral">{downloads}</td>
              <td className="py-3 px-4 text-right numeral">{formatNumber(locale, statsBySlug[article.slug]?.views ?? 0)}</td>
              <td className="py-3 px-4 text-right numeral">{formatNumber(locale, statsBySlug[article.slug]?.downloads ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
