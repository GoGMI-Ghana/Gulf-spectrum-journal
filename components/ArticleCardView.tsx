import Link from 'next/link'
import type { Article, Author, Issue, Topic } from '@/lib/types'
import BookmarkButton from './BookmarkButton'
import ArticleKicker from './ArticleKicker'

// Pure, synchronous view — takes already-resolved data, so it can be
// rendered from a Client Component too (e.g. the Bookmarks page, where the
// list of saved articles is only known client-side via localStorage).
// Deliberately has no import of lib/content: that module pulls in
// lib/supabase/server.ts (server-only, via next/headers), which would
// make this file unusable from a 'use client' component like
// BookmarksList. See ArticleCard.tsx for the Server Component wrapper
// that resolves authors/topic and renders this.
export function ArticleCardView({
  article,
  authors,
  topic,
  issue,
}: {
  article: Article
  authors: Author[]
  topic?: Topic
  issue?: Issue
}) {
  const authorNames = authors.map((a) => a.name).join(', ')

  return (
    <article className="py-5 border-b border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {topic && (
            <Link href={`/topics/${topic.slug}`} className="text-sm text-gold-ink hover:underline">
              {topic.label}
            </Link>
          )}
          <h3 className="font-display text-xl text-royal-blue leading-snug mt-1">
            <Link href={`/articles/${article.slug}`} className="hover:text-ocean-blue hover:underline underline-offset-2">
              {article.title}
            </Link>
          </h3>
        </div>
        <BookmarkButton slug={article.slug} className="shrink-0 -mr-2" />
      </div>
      <p className="text-slate-700 mt-1.5">
        {authorNames}
        {issue && <span className="text-slate-600"> · <ArticleKicker issueNumber={issue.number} /></span>}
      </p>
      <p className="text-[0.9375rem] text-slate-600 leading-relaxed mt-2 line-clamp-2">{article.abstract}</p>
    </article>
  )
}
