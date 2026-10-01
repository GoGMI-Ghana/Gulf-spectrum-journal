// Per-article link-preview card: the article's title and authors on the
// journal's colours. Takes only a slug and reads everything else from
// the database, so the image can't be made to display arbitrary text
// under the journal's name. An unknown (or unpublished) slug gets the
// generic card rather than an error — a broken preview image helps nobody.
import { getArticleBySlug, getAuthorsForArticle, getIssueForArticle } from '@/lib/content'
import { renderOgCard } from '@/lib/ogCard'
import { journal } from '@/lib/staticContent'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return renderOgCard({ kicker: 'Gulf of Guinea Maritime Institute', title: journal.name })
  }

  const [authors, issue] = await Promise.all([getAuthorsForArticle(article), getIssueForArticle(article)])
  return renderOgCard({
    kicker: issue ? `Research Article · Issue ${issue.number}` : 'Research Article',
    title: article.title,
    subtitle: authors.map((a) => a.name).join(', ') || undefined,
  })
}
