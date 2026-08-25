import type { Metadata } from 'next'
import { articles, getAuthorsForArticle, getIssueForArticle } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import PageBanner from '@/components/PageBanner'
import CitationRow from '@/components/CitationRow'

export const metadata: Metadata = {
  title: 'Citations',
  description: 'Ready-to-copy citations for every article published in Gulf Spectrum Journal.',
}

export default async function Citations() {
  const rows = await Promise.all(
    articles.map(async (article) => {
      const authors = await getAuthorsForArticle(article)
      const issue = await getIssueForArticle(article)
      return {
        slug: article.slug,
        title: article.title,
        citation: formatApaCitation(article, authors, issue),
      }
    })
  )

  return (
    <div>
      <PageBanner eyebrow="Citation Index" title="Citations" description="Formatted APA citations for every published article, generated from real author, issue, and journal data — ready to copy." />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {rows.map((row) => (
          <CitationRow key={row.slug} {...row} />
        ))}
      </section>
    </div>
  )
}
