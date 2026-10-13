import type { Metadata } from 'next'
import { getArticles, getAuthorsForArticle, getIssueForArticle, getTopicForArticle } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import CitationList from '@/components/CitationList'
import PageBanner from '@/components/PageBanner'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.citations.metaTitle, description: t.citations.metaDescription }
}

// A ready-to-copy citation for every published article. Each article's own
// page offers more styles and reference-manager downloads.
export default async function Citations({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const articles = await getArticles()
  const rows = await Promise.all(
    articles.map(async (article) => {
      const authors = await getAuthorsForArticle(article)
      const issue = await getIssueForArticle(article)
      const topic = await getTopicForArticle(article)
      return {
        slug: article.slug,
        title: article.title,
        citation: formatApaCitation(article, authors, issue),
        authorNames: authors.map((a) => a.name).join(', '),
        topicLabel: topic?.label,
        issueLabel: issue ? fmt(t.citations.issueLabel, { number: issue.number, year: issue.year }) : undefined,
      }
    })
  )

  return (
    <div>
      <PageBanner title={t.citations.metaTitle} description={t.citations.metaDescription} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {rows.length === 0 ? <p className="text-slate-600">{t.citations.empty}</p> : <CitationList rows={rows} />}
      </section>
    </div>
  )
}
