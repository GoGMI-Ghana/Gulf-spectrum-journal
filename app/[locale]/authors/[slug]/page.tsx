import Link from 'next/link'
import SideSection from '@/components/SideSection'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAuthors, getAuthorBySlug, getArticlesForAuthor, getIssues } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { socialMetadata } from '@/lib/seo'
import type { Author } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'
import AuthorAvatar from '@/components/AuthorAvatar'
import BoardBadge from '@/components/BoardBadge'
import ClaimAuthorLink from '@/components/ClaimAuthorLink'

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({ slug: author.slug }))
}

export async function generateMetadata({ params }: LocaleSlugParams): Promise<Metadata> {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: t.author.notFound }
  const description = author.bio || author.affiliation
  return {
    title: author.name,
    description,
    ...socialMetadata({ title: author.name, description, path: `/authors/${author.slug}` }),
  }
}

// Laid out like an author page on a publisher's site: who they are and
// where they work at the top, their articles as the main column, and
// biography, co-authors and the claim/edit box in the margin.
export default async function AuthorDetail({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const [articles, issues, allAuthors] = await Promise.all([getArticlesForAuthor(author.slug), getIssues(), getAuthors()])
  const issueBySlug = new Map(issues.map((i) => [i.slug, i]))
  const authorBySlug = new Map(allAuthors.map((a) => [a.slug, a]))

  const years = articles.map((a) => issueBySlug.get(a.issueSlug)?.year).filter((y): y is number => Boolean(y))
  const firstYear = years.length ? Math.min(...years) : null

  // Everyone this author has published with, most frequent first.
  const coAuthorCounts = new Map<string, number>()
  for (const article of articles) {
    for (const s of article.authorSlugs) {
      if (s !== author.slug) coAuthorCounts.set(s, (coAuthorCounts.get(s) ?? 0) + 1)
    }
  }
  const coAuthors = [...coAuthorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => authorBySlug.get(s))
    .filter((a): a is Author => Boolean(a))

  const countLine =
    articles.length === 1 ? t.author.articleCountOne : fmt(t.author.articleCountMany, { count: articles.length })

  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          <AuthorAvatar name={author.name} photo={author.photo} size="xl" className="rounded-full" />
          <div className="min-w-0">
            <h1 className="font-display text-royal-blue text-3xl sm:text-4xl leading-tight flex flex-wrap items-center gap-x-3 gap-y-1">
              {author.name}
              {author.boardTitle && <BoardBadge title={author.boardTitle} />}
            </h1>
            {author.credentials && <p className="text-slate-600 mt-1">{author.credentials}</p>}
            {author.affiliation && (
              <p className="text-slate-800 text-lg leading-snug mt-2 max-w-3xl">{author.affiliation}</p>
            )}
            {articles.length > 0 && (
              <p className="text-slate-600 mt-3">
                {countLine}
                {firstYear && <> · {fmt(t.author.since, { year: firstYear })}</>}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-x-14 gap-y-12">
        <div>
          <h2 className="font-display text-2xl text-royal-blue pb-2 border-b border-slate-300">{t.author.articles}</h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} issue={issueBySlug.get(article.issueSlug)} />
            ))}
          </div>
        </div>

        <aside className="space-y-10">
          <ClaimAuthorLink authorSlug={author.slug} authorName={author.name} claimed={author.claimed} />

          {author.bio && (
            <SideSection title={t.author.biography}>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{author.bio}</p>
            </SideSection>
          )}

          {coAuthors.length > 0 && (
            <SideSection title={t.author.coAuthors}>
              <ul>
                {coAuthors.map((c) => (
                  <li key={c.slug} className="flex items-center gap-3 py-2.5 border-b border-slate-200 last:border-0">
                    <AuthorAvatar name={c.name} photo={c.photo} size="sm" className="rounded-full" />
                    <div className="min-w-0">
                      <Link href={`/authors/${c.slug}`} className="font-medium text-ocean-blue hover:underline">
                        {c.name}
                      </Link>
                      {c.affiliation && <p className="text-sm text-slate-600 line-clamp-1">{c.affiliation}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </SideSection>
          )}

          <Link href="/authors" className="inline-block text-ocean-blue font-medium hover:underline">
            {t.author.back}
          </Link>
        </aside>
      </section>
    </div>
  )
}
