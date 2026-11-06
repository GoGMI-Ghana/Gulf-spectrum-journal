import Link from 'next/link'
import SideSection from '@/components/SideSection'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAuthors, getAuthorBySlug, getArticlesForAuthor } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { socialMetadata } from '@/lib/seo'
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
  return {
    title: author.name,
    description: author.bio,
    ...socialMetadata({ title: author.name, description: author.bio, path: `/authors/${author.slug}` }),
  }
}

export default async function AuthorDetail({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const articles = await getArticlesForAuthor(author.slug)

  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex items-center gap-6">
          <AuthorAvatar name={author.name} photo={author.photo} size="lg" />
          <div>
            <h1 className="font-display text-royal-blue text-3xl sm:text-4xl leading-tight mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {author.name}
              {author.boardTitle && <BoardBadge title={author.boardTitle} />}
            </h1>
            <p className="text-gold-ink">{author.credentials}</p>
            <p className="text-slate-700">{author.affiliation}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-royal-blue mb-2">
            {t.author.articles}
          </h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <SideSection title={t.author.biography}>
            <p className="text-slate-700 leading-relaxed">{author.bio}</p>
            <ClaimAuthorLink authorSlug={author.slug} claimed={author.claimed} />
            <Link href="/authors" className="inline-block mt-4 text-ocean-blue font-medium hover:underline">
              {t.author.back}
            </Link>
          </SideSection>
        </aside>
      </section>
    </div>
  )
}
