import type { Metadata } from 'next'
import { getArticles, getAuthorsForArticle, getTopicForArticle, getIssueForArticle } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import BookmarksList, { type ResolvedArticle } from '@/components/BookmarksList'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.bookmarks.metaTitle, description: t.bookmarks.metaDescription }
}

export default async function Bookmarks({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const articles = await getArticles()
  const allArticles: ResolvedArticle[] = await Promise.all(
    articles.map(async (article) => ({
      article,
      authors: await getAuthorsForArticle(article),
      topic: await getTopicForArticle(article),
      issue: await getIssueForArticle(article),
    }))
  )

  return (
    <div>
      <PageBanner
        eyebrow={t.bookmarks.eyebrow}
        title={t.bookmarks.title}
        description={t.bookmarks.description}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BookmarksList allArticles={allArticles} />
      </section>
    </div>
  )
}
