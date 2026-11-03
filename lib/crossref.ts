// Crossref DOI registration. GoGMI registers DOIs by uploading one XML file
// per issue in Crossref's admin tool; this builds that file (deposit schema
// 5.3.1) from the journal's own data, and works out the DOIs to use.
//
// DOI pattern: 10.68864/gsj for the journal, 10.68864/gsj.<year>.<NNN> for
// articles, numbered in order within each year. A registered DOI can never
// change, which is why no volume, issue or page number is in it.

import type { Article, Author, Issue } from './types'
import { journal } from './staticContent'
import { splitName } from './citation'

export const CROSSREF = {
  prefix: '10.68864',
  journalSuffix: 'gsj',
  // Who Crossref emails the result of each upload to — the account's
  // technical contact.
  depositorName: 'Gulf of Guinea Maritime Institute',
  depositorEmail: 'caleb@gogmi.org.gh',
  registrant: 'Gulf of Guinea Maritime Institute',
}

export const JOURNAL_DOI = `${CROSSREF.prefix}/${CROSSREF.journalSuffix}`

const ARTICLE_DOI = new RegExp(`^${CROSSREF.prefix.replace('.', '\\.')}/${CROSSREF.journalSuffix}\\.(\\d{4})\\.(\\d{3,})$`)

// DOIs for the issue's articles that don't have one yet, continuing the
// year's numbering after the highest article number already used.
// `taken` is every DOI already on any article in the journal.
export function suggestDois(articles: Article[], year: number, taken: string[]): Map<string, string> {
  let next =
    taken.reduce((max, doi) => {
      const m = ARTICLE_DOI.exec(doi)
      return m && Number(m[1]) === year ? Math.max(max, Number(m[2])) : max
    }, 0) + 1
  const out = new Map<string, string>()
  for (const article of articles) {
    if (article.doi) continue
    out.set(article.id, `${JOURNAL_DOI}.${year}.${String(next).padStart(3, '0')}`)
    next++
  }
  return out
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

// The issue's publication date as Crossref wants it: year always, month and
// day when the issue's date says them ("22 August 2023", "August 2023",
// "2023-08-22").
export function publicationDate(issue: Issue): { year: number; month?: number; day?: number } {
  const text = issue.publishedDate.trim()
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) }
  const words = /^(?:(\d{1,2})\s+)?([A-Za-z]+)\s+(\d{4})$/.exec(text)
  const month = words ? MONTHS.indexOf(words[2].toLowerCase()) + 1 : 0
  if (words && month > 0) return { year: Number(words[3]), month, day: words[1] ? Number(words[1]) : undefined }
  return { year: issue.year }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const two = (n: number) => String(n).padStart(2, '0')

function dateXml(date: ReturnType<typeof publicationDate>, indent: string) {
  return [
    `${indent}<publication_date media_type="online">`,
    ...(date.month ? [`${indent}  <month>${two(date.month)}</month>`] : []),
    ...(date.month && date.day ? [`${indent}  <day>${two(date.day)}</day>`] : []),
    `${indent}  <year>${date.year}</year>`,
    `${indent}</publication_date>`,
  ].join('\n')
}

export interface DepositEntry {
  article: Article
  authors: Author[]
  doi: string
  url: string
}

export function buildDepositXml({ issue, entries, siteUrl }: { issue: Issue; entries: DepositEntry[]; siteUrl: string }): string {
  const date = publicationDate(issue)
  const now = new Date()
  // Crossref keeps the deposit with the highest timestamp for each DOI, so
  // a later upload of a corrected file always wins.
  const timestamp = now.toISOString().replace(/\D/g, '').slice(0, 14)
  const batchId = `gsj-${issue.slug}-${timestamp}`

  const articlesXml = entries.map(({ article, authors, doi, url }) => {
    const contributors = authors.map((author, i) => {
      const { given, surname } = splitName(author.name)
      return [
        `        <person_name sequence="${i === 0 ? 'first' : 'additional'}" contributor_role="author">`,
        ...(given ? [`          <given_name>${esc(given)}</given_name>`] : []),
        `          <surname>${esc(surname)}</surname>`,
        ...(author.affiliation
          ? [
              '          <affiliations>',
              '            <institution>',
              `              <institution_name>${esc(author.affiliation)}</institution_name>`,
              '            </institution>',
              '          </affiliations>',
            ]
          : []),
        '        </person_name>',
      ].join('\n')
    })
    const references = article.references.map(
      (ref, i) => `        <citation key="ref${i + 1}">\n          <unstructured_citation>${esc(ref)}</unstructured_citation>\n        </citation>`
    )
    return [
      '    <journal_article publication_type="full_text" language="en">',
      '      <titles>',
      `        <title>${esc(article.title)}</title>`,
      '      </titles>',
      ...(contributors.length ? ['      <contributors>', ...contributors, '      </contributors>'] : []),
      ...(article.abstract ? ['      <jats:abstract>', `        <jats:p>${esc(article.abstract)}</jats:p>`, '      </jats:abstract>'] : []),
      dateXml(date, '      '),
      '      <doi_data>',
      `        <doi>${esc(doi)}</doi>`,
      `        <resource>${esc(url)}</resource>`,
      '      </doi_data>',
      // Crossref matches these against registered works to link references.
      ...(references.length ? ['      <citation_list>', ...references, '      </citation_list>'] : []),
      '    </journal_article>',
    ].join('\n')
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch version="5.3.1" xmlns="http://www.crossref.org/schema/5.3.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1"
  xsi:schemaLocation="http://www.crossref.org/schema/5.3.1 https://www.crossref.org/schemas/crossref5.3.1.xsd">
  <head>
    <doi_batch_id>${esc(batchId)}</doi_batch_id>
    <timestamp>${timestamp}</timestamp>
    <depositor>
      <depositor_name>${esc(CROSSREF.depositorName)}</depositor_name>
      <email_address>${esc(CROSSREF.depositorEmail)}</email_address>
    </depositor>
    <registrant>${esc(CROSSREF.registrant)}</registrant>
  </head>
  <body>
    <journal>
    <journal_metadata language="en">
      <full_title>${esc(journal.name)}</full_title>
      <abbrev_title>Gulf Spectr. J.</abbrev_title>
${journal.issn ? `      <issn media_type="electronic">${esc(journal.issn)}</issn>\n` : ''}      <doi_data>
        <doi>${JOURNAL_DOI}</doi>
        <resource>${esc(siteUrl)}/</resource>
      </doi_data>
    </journal_metadata>
    <journal_issue>
${dateXml(date, '      ')}
      <journal_volume>
        <volume>${issue.volume}</volume>
      </journal_volume>
      <issue>${issue.number}</issue>
    </journal_issue>
${articlesXml.join('\n')}
    </journal>
  </body>
</doi_batch>
`
}
