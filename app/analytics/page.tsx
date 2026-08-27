import type { Metadata } from 'next'
import { getArticles, getTopics, getAuthors, getTopicForArticle, getAuthorsForArticle } from '@/lib/content'
import { getArticleStatsById, getArticleDailyStatsById, type ArticleStat } from '@/lib/analytics'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Readership analytics for Gulf Spectrum Journal.',
}

// Statically generated like the rest of the content pages, but re-checked
// periodically rather than only at build time — unlike article/issue/topic
// content, view counts are expected to actually change between deploys.
export const revalidate = 300

export default async function AnalyticsPage() {
  const [articles, topics, authors, statsById, dailyStatsById] = await Promise.all([
    getArticles(),
    getTopics(),
    getAuthors(),
    getArticleStatsById(),
    getArticleDailyStatsById(),
  ])

  const topicByArticleSlug: Record<string, string> = {}
  const authorNamesByArticleSlug: Record<string, string[]> = {}

  for (const article of articles) {
    const topic = await getTopicForArticle(article)
    if (topic) topicByArticleSlug[article.slug] = topic.slug
    const articleAuthors = await getAuthorsForArticle(article)
    authorNamesByArticleSlug[article.slug] = articleAuthors.map((a) => a.name)
  }

  // Both analytics views are keyed by article_id — remap to slug here,
  // since that's what the rest of the app (and the dashboard component)
  // already keys everything else by.
  const EMPTY_STAT: ArticleStat = { views: 0, downloads: 0 }
  const statsBySlug: Record<string, ArticleStat> = {}
  const dailyStatsBySlug: Record<string, Record<string, ArticleStat>> = {}
  for (const article of articles) {
    statsBySlug[article.slug] = statsById[article.id] ?? EMPTY_STAT
    dailyStatsBySlug[article.slug] = dailyStatsById[article.id] ?? {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-royal-blue text-2xl mb-6">Analytics</h1>
      <AnalyticsDashboard
        articles={articles}
        topics={topics}
        authors={authors}
        topicByArticleSlug={topicByArticleSlug}
        authorNamesByArticleSlug={authorNamesByArticleSlug}
        statsBySlug={statsBySlug}
        dailyStatsBySlug={dailyStatsBySlug}
      />
    </div>
  )
}
