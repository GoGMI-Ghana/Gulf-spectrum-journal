import Link from 'next/link'
import type { Metadata } from 'next'
import { Search as SearchIcon } from 'lucide-react'
import { searchArticles, getIssueForArticle } from '@/lib/content'
import { getDictionary, toLocale } from '@/lib/i18n'
import { fmt, plural, rich } from '@/lib/i18n/format'
import PageBanner from '@/components/PageBanner'
import ArticleCard from '@/components/ArticleCard'

interface SearchProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params, searchParams }: SearchProps): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  const { q } = await searchParams
  const query = q ?? ''
  return {
    title: query ? fmt(t.search.metaTitleQuery, { query }) : t.search.metaTitle,
    description: fmt(t.search.metaDescription, { query }),
  }
}

export default async function Search({ params, searchParams }: SearchProps) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const { q } = await searchParams
  const query = q ?? ''
  const results = await searchArticles(query)
  const issues = await Promise.all(results.map((a) => getIssueForArticle(a)))

  return (
    <div>
      <PageBanner
        title={query ? fmt(t.search.resultsFor, { query }) : t.search.title}
        description={query ? plural(locale, t.search.found, results.length) : t.search.prompt}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* A plain form that reloads this page with ?q=… — it works without
            JavaScript, and the box keeps what was searched for. */}
        <form action="/search" method="get" role="search" className="flex items-stretch border border-slate-300 focus-within:border-royal-blue mb-10">
          <input
            type="search"
            name="q"
            defaultValue={query}
            required
            autoFocus={!query}
            placeholder={t.subNav.searchPlaceholder}
            aria-label={t.subNav.searchPlaceholder}
            className="w-full px-4 py-3 text-base focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-royal-blue text-white px-5 font-medium text-sm shrink-0 hover:bg-ocean-blue transition-colors"
          >
            <SearchIcon size={16} />
            {t.subNav.search}
          </button>
        </form>

        {query && results.length === 0 && (
          <p className="text-slate-600">
            {rich(t.search.noResults, {
              query,
              link: (
                <Link href="/issues" className="text-ocean-blue hover:underline">{t.search.allIssues}</Link>
              ),
            })}
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
