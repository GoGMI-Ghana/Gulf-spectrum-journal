// The downloadable PDF of a published article, generated on request from
// the same data the article page uses — so it's always current, with no
// file for an editor to upload or forget to replace. Under /api so
// proxy.ts doesn't put it through the language rewrite.
import { getArticleBySlug, getAuthorsForArticle, getIssueForArticle, getTopicForArticle } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import { renderArticlePdf } from '@/lib/pdf/articlePdf'
import { doiUrl } from '@/lib/doi'
import { siteUrl } from '@/lib/seo'

// Fetching and re-encoding an image-heavy article's pictures can outlast
// the default function timeout.
export const maxDuration = 60

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Published articles only — same query the article page uses.
  const article = await getArticleBySlug(slug)
  if (!article) return new Response('Article not found', { status: 404 })

  const [authors, issue, topic] = await Promise.all([
    getAuthorsForArticle(article),
    getIssueForArticle(article),
    getTopicForArticle(article),
  ])

  let pdf: Buffer
  try {
    pdf = await renderArticlePdf({
      article,
      authors,
      issue,
      topic,
      citation: formatApaCitation(article, authors, issue),
      url: article.doi ? doiUrl(article.doi) : `${siteUrl}/articles/${article.slug}`,
    })
  } catch (err) {
    console.error('Failed to generate article PDF', slug, err)
    return new Response('The PDF could not be generated.', { status: 500 })
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${article.slug}.pdf"`,
      // Short CDN cache: an edit to the article should reach the PDF
      // within minutes, without regenerating it for every download.
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  })
}
