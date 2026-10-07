// The downloadable PDF of a whole published issue — cover, contents and
// every article — generated on request from the same data the site shows,
// so it never goes stale. It is also the "final soft copy" the journal
// sends for legal deposit each time an issue is published. Under /api so
// proxy.ts doesn't put it through the language rewrite.
import { getArticlesForIssue, getAuthorsForArticle, getIssueBySlug, getTopicForArticle } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import { renderIssuePdf } from '@/lib/pdf/issuePdf'
import { siteUrl } from '@/lib/seo'

// Every picture in every article is fetched and re-encoded, which can
// outlast the default function timeout.
export const maxDuration = 60

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Published issues and articles only — same queries the issue page uses.
  const issue = await getIssueBySlug(slug)
  if (!issue) return new Response('Issue not found', { status: 404 })
  const issueArticles = await getArticlesForIssue(issue.slug)
  if (issueArticles.length === 0) return new Response('This issue has no published articles yet.', { status: 404 })

  const articles = await Promise.all(
    issueArticles.map(async (article) => {
      const [authors, topic] = await Promise.all([getAuthorsForArticle(article), getTopicForArticle(article)])
      return {
        article,
        authors,
        topic,
        citation: formatApaCitation(article, authors, issue),
        url: `${siteUrl}/articles/${article.slug}`,
      }
    })
  )

  let pdf: Buffer
  try {
    pdf = await renderIssuePdf({ issue, articles, url: `${siteUrl}/issues/${issue.slug}` })
  } catch (err) {
    console.error('Failed to generate issue PDF', slug, err)
    return new Response('The PDF could not be generated.', { status: 500 })
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="gulf-spectrum-journal-vol-${issue.volume}-no-${issue.number}.pdf"`,
      // Short CDN cache, as for article PDFs: an edit reaches the file
      // within minutes without regenerating it for every download.
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  })
}
