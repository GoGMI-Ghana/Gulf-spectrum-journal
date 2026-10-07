// Builds the downloadable PDF of a whole issue (GET /api/issues/[slug]/pdf):
// a cover page, the contents and editorial board, then every article in
// the issue, each starting on a new page and laid out exactly as in its
// own PDF. This is the file sent to the Ghana Library Authority as the
// issue's legal deposit copy.
//
// Server-only. English labels, for the same reasons as the article PDF.

import { Document, Page, Text, View, renderToBuffer } from '@react-pdf/renderer'
import type { Issue } from '../types'
import { journal } from '../staticContent'
import { ArticleContent, articleHtmlBodies, type ArticlePdfInput } from './articlePdf'
import { prepareImages } from './htmlToPdf'
import { pdfStyles as s } from './styles'

export interface IssuePdfInput {
  issue: Issue
  // In the order they appear on the issue's page.
  articles: Omit<ArticlePdfInput, 'issue'>[]
  url: string
}

export async function renderIssuePdf({ issue, articles, url }: IssuePdfInput): Promise<Buffer> {
  const images = await prepareImages(articles.flatMap(({ article }) => articleHtmlBodies(article)))
  const issueLine = `Vol. ${issue.volume}, No. ${issue.number} (${issue.year})`
  const coverFooter = [
    issue.publishedDate ? `Published ${issue.publishedDate}` : '',
    journal.issn ? `ISSN ${journal.issn}` : '',
    url,
  ].filter(Boolean)

  return renderToBuffer(
    <Document
      title={`${journal.name} — ${issueLine}${issue.theme ? `: ${issue.theme}` : ''}`}
      author={journal.publisher}
      subject={issue.aboutThisVolume}
      creator={journal.name}
      producer={journal.name}
    >
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverJournal}>{journal.name}</Text>
        <Text style={s.coverPublisher}>A publication of the {journal.publisher}</Text>
        <View style={s.coverRule} />
        <Text style={s.coverIssue}>
          Volume {issue.volume} · Issue {issue.number} · {issue.year}
        </Text>
        {issue.theme ? <Text style={s.coverTheme}>{issue.theme}</Text> : null}
        {issue.aboutThisVolume ? <Text style={s.coverAbout}>{issue.aboutThisVolume}</Text> : null}
        <View style={s.coverFooter}>
          {coverFooter.map((line) => (
            <Text key={line} style={s.coverFooterText}>
              {line}
            </Text>
          ))}
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <Text>{journal.name}</Text>
          <Text>{issueLine}</Text>
        </View>

        <Text style={s.sectionHeading}>Contents</Text>
        {articles.map(({ article, authors }) => (
          <View key={article.slug} style={s.contentsEntry} wrap={false}>
            <Text style={s.contentsTitle}>{article.title}</Text>
            <Text style={s.contentsAuthors}>{authors.map((a) => a.name).join(', ')}</Text>
          </View>
        ))}

        {issue.editorialBoard.length > 0 && (
          <View wrap={false}>
            <Text style={s.sectionHeading}>Editorial Board for this Issue</Text>
            {issue.editorialBoard.map((member) => (
              <Text key={member.name} style={s.boardMember}>
                <Text style={{ fontWeight: 'bold' }}>{member.name}</Text>
                {member.role ? ` — ${member.role}` : ''}
              </Text>
            ))}
          </View>
        )}

        {articles.map((entry) => (
          <View key={entry.article.slug} break>
            <ArticleContent {...entry} images={images} />
          </View>
        ))}

        <Text style={s.footerLeft} fixed>
          © {issue.year} {journal.publisher}
        </Text>
        <Text style={s.footerRight} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  )
}
