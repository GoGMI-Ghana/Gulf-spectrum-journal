'use client'

import Link from 'next/link'
import { useBookmarks } from '@/context/BookmarksContext'
import { ArticleCardView } from './ArticleCardView'
import type { Article, Author, Issue, Topic } from '@/lib/types'

export interface ResolvedArticle {
  article: Article
  authors: Author[]
  topic?: Topic
  issue?: Issue
}

export default function BookmarksList({ allArticles }: { allArticles: ResolvedArticle[] }) {
  const { user, authLoading, bookmarks, bookmarksLoading } = useBookmarks()

  if (authLoading) return null

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href="/sign-in?redirect=/bookmarks" className="text-ocean-blue hover:underline">Sign in</Link>{' '}
        to see your bookmarks — they&apos;re saved to your account now, not just this browser.
      </p>
    )
  }

  if (bookmarksLoading) {
    return <p className="text-slate-500 text-sm">Loading your bookmarks…</p>
  }

  const saved = allArticles.filter((a) => bookmarks.includes(a.article.slug))

  if (saved.length === 0) {
    return (
      <p className="text-slate-600">
        No bookmarks yet. Open any article and tap the bookmark icon to save it here.
        Browse{' '}
        <Link href="/issues" className="text-ocean-blue hover:underline">articles and issues</Link>{' '}
        to get started.
      </p>
    )
  }

  return (
    <div>
      {saved.map(({ article, authors, topic, issue }) => (
        <ArticleCardView key={article.slug} article={article} authors={authors} topic={topic} issue={issue} />
      ))}
    </div>
  )
}
