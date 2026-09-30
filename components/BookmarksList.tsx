'use client'

import Link from 'next/link'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { rich } from '@/lib/i18n/format'
import { ArticleCardView } from './ArticleCardView'
import type { Article, Author, Issue, Topic } from '@/lib/types'

export interface ResolvedArticle {
  article: Article
  authors: Author[]
  topic?: Topic
  issue?: Issue
}

export default function BookmarksList({ allArticles }: { allArticles: ResolvedArticle[] }) {
  const { user, authLoading, bookmarks, bookmarksLoading } = useAccount()
  const { t } = useI18n()

  if (authLoading) return null

  if (!user) {
    return (
      <p className="text-slate-600">
        {rich(t.bookmarks.signInPrompt, {
          link: (
            <Link href="/sign-in?redirect=/bookmarks" className="text-ocean-blue hover:underline">
              {t.common.signIn}
            </Link>
          ),
        })}
      </p>
    )
  }

  if (bookmarksLoading) {
    return <p className="text-slate-500 text-sm">{t.bookmarks.loading}</p>
  }

  const saved = allArticles.filter((a) => bookmarks.includes(a.article.slug))

  if (saved.length === 0) {
    return (
      <p className="text-slate-600">
        {rich(t.bookmarks.empty, {
          link: (
            <Link href="/issues" className="text-ocean-blue hover:underline">
              {t.bookmarks.emptyLink}
            </Link>
          ),
        })}
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
