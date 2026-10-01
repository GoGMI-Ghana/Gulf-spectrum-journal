import Link from 'next/link'
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
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center gap-6">
          <AuthorAvatar name={author.name} photo={author.photo} size="lg" />
          <div>
            <h1 className="font-display text-white text-2xl sm:text-3xl mb-1 flex items-center gap-2.5">
              {author.name}
              {author.boardTitle && <BoardBadge title={author.boardTitle} className="!bg-gold !text-royal-blue" />}
            </h1>
            <p className="text-gold text-sm">{author.credentials}</p>
            <p className="text-white/70 text-sm">{author.affiliation}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
            {t.author.articles}
          </h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-3">{t.author.biography}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{author.bio}</p>
            <ClaimAuthorLink authorSlug={author.slug} claimed={author.claimed} />
            <Link href="/authors" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              {t.author.back}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
