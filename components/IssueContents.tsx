import Link from 'next/link'
import { getAuthorsForArticle, getTopicForArticle } from '@/lib/content'
import { doiUrl } from '@/lib/doi'
import type { Article } from '@/lib/types'

// An issue's table of contents, set the way a printed journal's is: topic,
// title, authors and DOI for each article, no abstracts. Used on the home
// page (current issue) and on each issue's page. Server Component: it reads
// each article's authors and topic.
export default async function IssueContents({ articles }: { articles: Article[] }) {
  const rows = await Promise.all(
    articles.map(async (article) => ({
      article,
      authors: await getAuthorsForArticle(article),
      topic: await getTopicForArticle(article),
    }))
  )

  return (
    <ol className="divide-y divide-slate-200 border-y border-slate-200">
      {rows.map(({ article, authors, topic }) => (
        <li key={article.slug} className="py-5">
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
          <p className="text-slate-700 mt-1.5">{authors.map((a) => a.name).join(', ')}</p>
          {article.doi && (
            <p className="text-sm mt-1">
              <a href={doiUrl(article.doi)} className="text-slate-600 hover:text-ocean-blue hover:underline break-all">
                {doiUrl(article.doi)}
              </a>
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
