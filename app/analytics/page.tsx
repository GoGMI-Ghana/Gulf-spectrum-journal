import type { Metadata } from 'next'
import { articles, issues, authors, topics, getTopicForArticle } from '@/lib/content'
import { seededNumber } from '@/lib/seededNumber'
import PageBanner from '@/components/PageBanner'
import AnalyticsTable, { type AnalyticsRow } from '@/components/AnalyticsTable'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Readership analytics for Gulf Spectrum Journal.',
}

const stats = [
  { label: 'Articles Published', value: articles.length },
  { label: 'Issues', value: issues.length },
  { label: 'Contributing Authors', value: authors.length },
  { label: 'Topics Covered', value: topics.length },
]

export default async function AnalyticsPage() {
  const rows: AnalyticsRow[] = await Promise.all(
    articles.map(async (article) => {
      const topic = await getTopicForArticle(article)
      return {
        slug: article.slug,
        title: article.title,
        topicLabel: topic?.label ?? '—',
        views: seededNumber(article.slug, 180, 2400),
        downloads: seededNumber(article.slug + '-dl', 20, 400),
      }
    })
  )

  return (
    <div>
      <PageBanner eyebrow="Journal Analytics" title="Analytics" description="Readership and engagement across Gulf Spectrum Journal." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-6">
              <p className="numeral text-royal-blue text-3xl font-bold leading-none mb-1">{s.value}</p>
              <p className="text-slate-500 text-xs uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 border-b-2 border-royal-blue pb-3">
          <h2 className="text-xl font-bold text-royal-blue font-display">By Article</h2>
          <p className="text-xs text-slate-500">Views and downloads are illustrative until tracking is connected.</p>
        </div>

        <AnalyticsTable rows={rows} />
      </section>
    </div>
  )
}
