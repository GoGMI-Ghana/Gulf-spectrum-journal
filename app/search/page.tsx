import Link from 'next/link'
import type { Metadata } from 'next'
import { searchArticles, getIssueForArticle } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import ArticleCard from '@/components/ArticleCard'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  const query = q ?? ''
  return {
    title: query ? `Search: ${query}` : 'Search',
    description: `Search results for "${query}" across Gulf Spectrum Journal.`,
  }
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q ?? ''
  const results = await searchArticles(query)
  const issues = await Promise.all(results.map((a) => getIssueForArticle(a)))

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
            <Link href="/issues" className="text-ocean-blue hover:underline">all issues</Link>.
          </p>
        )}
        <div>
          {results.map((article, i) => (
            <ArticleCard key={article.slug} article={article} issue={issues[i]} />
          ))}
        </div>
      </section>
    </div>
  )
}
