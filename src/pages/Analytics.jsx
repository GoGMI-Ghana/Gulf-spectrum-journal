import { Link } from 'react-router-dom'
import { articles, issues, authors, topics, getTopicForArticle } from '../data/content'
import { useBookmarks } from '../context/BookmarksContext'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

// Deterministic placeholder numbers (seeded by slug) so they stay stable
// across reloads instead of jumping around on every render. Swap for real
// pageview/download tracking once the backend is connected.
function seededNumber(seed, min, max) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const normalized = Math.abs(hash % 1000) / 1000
  return Math.floor(min + normalized * (max - min))
}

const stats = [
  { label: 'Articles Published', value: articles.length },
  { label: 'Issues', value: issues.length },
  { label: 'Contributing Authors', value: authors.length },
  { label: 'Topics Covered', value: topics.length },
]

export default function AnalyticsPage() {
  const { bookmarks } = useBookmarks()
  usePageMeta('Analytics', 'Readership analytics for Gulf Spectrum Journal.')

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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <th className="py-3 pr-4 font-medium">Article</th>
                <th className="py-3 pr-4 font-medium">Topic</th>
                <th className="py-3 pr-4 font-medium text-right">Views</th>
                <th className="py-3 pr-4 font-medium text-right">Downloads</th>
                <th className="py-3 font-medium text-right">Bookmarked (this browser)</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const topic = getTopicForArticle(article)
                const views = seededNumber(article.slug, 180, 2400)
                const downloads = seededNumber(article.slug + '-dl', 20, 400)
                return (
                  <tr key={article.slug} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <Link to={`/articles/${article.slug}`} className="text-royal-blue hover:text-ocean-blue font-medium">
                        {article.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{topic?.label ?? '—'}</td>
                    <td className="py-3 pr-4 text-right numeral">{views.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right numeral">{downloads.toLocaleString()}</td>
                    <td className="py-3 text-right">{bookmarks.includes(article.slug) ? 'Yes' : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
