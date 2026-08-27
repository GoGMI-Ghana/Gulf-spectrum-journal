import type { Metadata } from 'next'
import { getArticles, getAuthorsForArticle, getTopicForArticle, getIssueForArticle } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import BookmarksList, { type ResolvedArticle } from '@/components/BookmarksList'

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Articles you have bookmarked on Gulf Spectrum Journal.',
}

export default async function Bookmarks() {
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
        eyebrow="Your Reading List"
        title="Bookmarks"
        description="Saved to this browser only — bookmarks aren't tied to an account yet, so they won't follow you to another device."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BookmarksList allArticles={allArticles} />
      </section>
    </div>
  )
}
