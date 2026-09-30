import Link from 'next/link'
import type { Metadata } from 'next'
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
        eyebrow={t.search.eyebrow}
        title={query ? fmt(t.search.resultsFor, { query }) : t.search.title}
        description={query ? plural(locale, t.search.found, results.length) : t.search.prompt}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
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
