import { Link } from 'react-router-dom'
import { useBookmarks } from '../context/BookmarksContext'
import { getArticleBySlug, getIssueForArticle } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'
import ArticleCard from '../components/ArticleCard'

export default function Bookmarks() {
  const { bookmarks } = useBookmarks()
  usePageMeta('Bookmarks', 'Articles you have bookmarked on Gulf Spectrum Journal.')

  const articles = bookmarks.map((slug) => getArticleBySlug(slug)).filter(Boolean)

  return (
    <div>
      <PageBanner
        eyebrow="Your Reading List"
        title="Bookmarks"
        description="Saved to this browser only — bookmarks aren't tied to an account yet, so they won't follow you to another device."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.length === 0 ? (
          <p className="text-slate-600">
            No bookmarks yet. Open any article and tap the bookmark icon to save it here.
            Browse{' '}
            <Link to="/issues" className="text-ocean-blue hover:underline">articles and issues</Link>{' '}
            to get started.
          </p>
        ) : (
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} issue={getIssueForArticle(article)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
