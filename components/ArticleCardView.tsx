import Link from 'next/link'
import type { Article, Author, Issue, Topic } from '@/lib/types'
import BookmarkButton from './BookmarkButton'

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
    <article className="py-6 border-b border-slate-200 group">
      <div className="flex items-start justify-between gap-3">
        <p className="kicker text-ocean-blue mb-2 flex flex-wrap items-center gap-x-2">
          <span>
            Research Article
            {issue && <span className="text-slate-400 font-normal normal-case tracking-normal"> — Issue {issue.number}</span>}
          </span>
          {topic && (
            <Link
              href={`/topics/${topic.slug}`}
              className="text-royal-blue bg-soft-gold px-2 py-0.5 font-normal normal-case tracking-normal hover:bg-gold hover:text-ink transition-colors"
            >
              {topic.label}
            </Link>
          )}
        </p>
        <BookmarkButton slug={article.slug} className="shrink-0" />
      </div>
      <h3 className="text-lg font-semibold text-royal-blue leading-snug mb-1.5 font-display">
        <Link href={`/articles/${article.slug}`} className="group-hover:text-ocean-blue">
          {article.title}
        </Link>
      </h3>
      <p className="text-sm text-slate-600 mb-2 italic">{authorNames}</p>
      <p className="text-sm text-slate-500 line-clamp-2">{article.abstract}</p>
    </article>
  )
}
