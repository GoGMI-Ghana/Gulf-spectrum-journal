import type { Metadata } from 'next'
import { articles, topics, authors, getTopicForArticle, getAuthorsForArticle } from '@/lib/content'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Readership analytics for Gulf Spectrum Journal.',
}

export default async function AnalyticsPage() {
  const topicByArticleSlug: Record<string, string> = {}
  const authorNamesByArticleSlug: Record<string, string[]> = {}

  for (const article of articles) {
    const topic = await getTopicForArticle(article)
    if (topic) topicByArticleSlug[article.slug] = topic.slug
    const articleAuthors = await getAuthorsForArticle(article)
    authorNamesByArticleSlug[article.slug] = articleAuthors.map((a) => a.name)
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
      />
    </div>
  )
}
