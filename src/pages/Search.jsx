import { useSearchParams } from 'react-router-dom'
import { searchArticles, getIssueForArticle } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'
import ArticleCard from '../components/ArticleCard'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = searchArticles(query)

  usePageMeta(query ? `Search: ${query}` : 'Search', `Search results for "${query}" across Gulf Spectrum Journal.`)

  return (
    <div>
      <PageBanner
        eyebrow="Search"
        title={query ? `Results for “${query}”` : 'Search'}
        description={
          query
            ? `${results.length} article${results.length === 1 ? '' : 's'} found across titles, abstracts, keywords, and authors.`
            : 'Enter a search term to find articles by title, abstract, keyword, or author.'
        }
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {query && results.length === 0 && (
          <p className="text-slate-600">
            No articles matched “{query}.” Try a different term, or browse{' '}
            <a href="/issues" className="text-ocean-blue hover:underline">all issues</a>.
          </p>
        )}
        <div>
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} issue={getIssueForArticle(article)} />
          ))}
        </div>
      </section>
    </div>
  )
}
