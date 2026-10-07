// Builds the downloadable PDF of an article (GET
// /api/articles/[slug]/pdf): title block, abstract, the formatted body
// with its images and tables, references, and how to cite — on A4 with a
// running header, page numbers, and the journal's colours.
//
// Server-only. Labels are English: the article text itself is, and one
// PDF per article (rather than per reader language) can be cached.

import { Document, Page, Text, View, renderToBuffer } from '@react-pdf/renderer'
import type { Article, Author, Issue, Topic } from '../types'
import { looksLikeHtml } from '../richText'
import { sanitizeArticleHtml } from '../sanitizeArticleHtml'
import { journal } from '../staticContent'
import { htmlToPdf, plainTextToPdf, prepareImages, type PdfImage } from './htmlToPdf'
import { pdfStyles as s } from './styles'

export interface ArticlePdfInput {
  article: Article
  authors: Author[]
  issue: Issue | undefined
  topic: Topic | undefined
  citation: string
  url: string
}

// Sanitized exactly as for the web page, so the PDF can never contain
// anything the page wouldn't.
// Charts are kept as placeholders rather than turned into web markup —
// htmlToPdf draws them itself.
const sanitizeForPdf = (html: string) => sanitizeArticleHtml(html, { charts: 'keep' })

function richText(value: string, images: Map<string, PdfImage>, key: string) {
  return looksLikeHtml(value) ? htmlToPdf(sanitizeForPdf(value), images, key) : plainTextToPdf(value, key)
}

// The HTML bodies of an article, sanitized for the PDF — what
// prepareImages needs to fetch that article's pictures.
export function articleHtmlBodies(article: Article): string[] {
  return [...article.sections.map((section) => section.body), article.conclusion].filter(looksLikeHtml).map(sanitizeForPdf)
}

// One article, from its title to its "cite this article" box. Shared by
// the single-article PDF and the whole-issue PDF (lib/pdf/issuePdf.tsx).
export function ArticleContent({
  article,
  authors,
  topic,
  citation,
  url,
  images,
}: Omit<ArticlePdfInput, 'issue'> & { images: Map<string, PdfImage> }) {
  return (
    <>
      <Text style={s.kicker}>{topic ? `Research Article · ${topic.label}` : 'Research Article'}</Text>
      <Text style={s.title}>{article.title}</Text>

      {authors.map((author) => (
        <View key={author.slug}>
          <Text style={s.authorName}>{author.name}</Text>
          {author.affiliation ? <Text style={s.authorAffiliation}>{author.affiliation}</Text> : null}
        </View>
      ))}

      {article.correctionNote ? (
        <View style={s.correctionBox}>
          <Text style={s.label}>Correction</Text>
          <Text style={s.abstractText}>{article.correctionNote}</Text>
        </View>
      ) : null}

      <View style={s.abstractBox}>
        <Text style={s.label}>Abstract</Text>
        <Text style={s.abstractText}>{article.abstract}</Text>
      </View>

      {article.keywords.length > 0 && (
        <Text style={s.keywords}>
          <Text style={{ fontWeight: 'bold' }}>Keywords: </Text>
          {article.keywords.join('; ')}
        </Text>
      )}

      {article.sections.map((section, i) => (
        <View key={i}>
          {section.heading ? (
            // Never strand a heading at the foot of a page.
            <Text style={s.sectionHeading} minPresenceAhead={60}>
              {section.heading}
            </Text>
          ) : null}
          {richText(section.body, images, `${article.slug}-s${i}`)}
        </View>
      ))}

      {article.conclusion ? (
        <View>
          <Text style={s.sectionHeading} minPresenceAhead={60}>
            Conclusion
          </Text>
          {richText(article.conclusion, images, `${article.slug}-c`)}
        </View>
      ) : null}

      {article.disclosure ? (
        <View>
          <Text style={s.sectionHeading} minPresenceAhead={60}>
            Funding and conflicts of interest
          </Text>
          {plainTextToPdf(article.disclosure, `${article.slug}-d`)}
        </View>
      ) : null}

      {article.references.length > 0 && (
        <View>
          {article.references.map((reference, i) => {
            const entry = (
              <View key={i} style={s.reference} wrap={false}>
                <Text style={s.referenceNumber}>{i + 1}.</Text>
                <Text style={s.referenceText}>{reference}</Text>
              </View>
            )
            // The heading travels with the first reference, so it is never
            // left alone at the foot of a page.
            return i === 0 ? (
              <View key={i} wrap={false}>
                <Text style={s.sectionHeading}>References</Text>
                {entry}
              </View>
            ) : (
              entry
            )
          })}
        </View>
      )}

      <View style={s.citeBox} wrap={false}>
        <Text style={s.label}>Cite this article</Text>
        <Text style={s.citeText}>{citation}</Text>
        <Text style={s.smallPrint}>{url}</Text>
      </View>
    </>
  )
}

export async function renderArticlePdf({ article, authors, issue, topic, citation, url }: ArticlePdfInput): Promise<Buffer> {
  const images = await prepareImages(articleHtmlBodies(article))

  const issueLine = issue ? `Vol. ${issue.volume}, No. ${issue.number} (${issue.year})` : ''

  return renderToBuffer(
    <Document
      title={article.title}
      author={authors.map((a) => a.name).join(', ')}
      subject={article.abstract}
      keywords={article.keywords.join(', ')}
      creator={journal.name}
      producer={journal.name}
    >
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <Text>{journal.name}</Text>
          <Text>{issueLine}</Text>
        </View>
        <ArticleContent article={article} authors={authors} topic={topic} citation={citation} url={url} images={images} />

        <Text style={s.footerLeft} fixed>
          © {issue?.year ?? new Date().getFullYear()} {journal.publisher}
        </Text>
        <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />

      </Page>
    </Document>
  )
}
