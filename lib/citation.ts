import { journal } from './staticContent'
import type { Article, Author, Issue } from './types'

const TITLE_PREFIX = /^(?:(?:Dr|Prof|Capt|Cdr|Lt|Sub-Lt)\.\s+|Rear Admiral \(Rtd\)\s+)+/

// The last word is taken as the surname. That is wrong for compound
// surnames ("van der Merwe"), which is why every style is offered as text
// the reader can copy and adjust rather than as something final.
interface CitedName {
  given: string
  surname: string
}

function parseName(name: string): CitedName {
  const parts = name.replace(TITLE_PREFIX, '').split(' ').filter(Boolean)
  if (parts.length < 2) return { given: '', surname: parts[0] ?? '' }
  return { given: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] }
}

function initials(given: string): string {
  return given.split(' ').map((p) => `${p[0].toUpperCase()}.`).join(' ')
}

// "Mensah, K. A."
function surnameInitials({ given, surname }: CitedName): string {
  return given ? `${surname}, ${initials(given)}` : surname
}

// "Mensah, Kofi A."
function surnameFirst({ given, surname }: CitedName): string {
  return given ? `${surname}, ${given}` : surname
}

// "Kofi A. Mensah"
function givenFirst({ given, surname }: CitedName): string {
  return given ? `${given} ${surname}` : surname
}

function joinWith(items: string[], last: string): string {
  if (items.length < 2) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')}${last}${items[items.length - 1]}`
}

export function formatApaCitation(article: Article, authors: Author[], issue: Issue | undefined, url?: string): string {
  const authorStr = joinWith(authors.map((a) => surnameInitials(parseName(a.name))), ', & ')
  const year = issue?.year ?? ''
  const vol = issue?.volume ?? ''
  const num = issue?.number ?? ''
  return `${authorStr} (${year}). ${article.title}. ${journal.name}, ${vol}(${num}).${url ? ` ${url}` : ''}`
}

function formatMla(article: Article, names: CitedName[], issue: Issue | undefined, url: string): string {
  // MLA lists one or two authors and shortens three or more to "et al.";
  // only the first is inverted.
  const authorStr =
    names.length > 2
      ? `${surnameFirst(names[0])}, et al`
      : names.length === 2
        ? `${surnameFirst(names[0])}, and ${givenFirst(names[1])}`
        : surnameFirst(names[0] ?? { given: '', surname: '' })
  const where = issue ? `, vol. ${issue.volume}, no. ${issue.number}, ${issue.year}` : ''
  return `${authorStr}${authorStr.endsWith('.') ? '' : '.'} “${article.title}.” ${journal.name}${where}, ${url}.`
}

function formatChicago(article: Article, names: CitedName[], issue: Issue | undefined, url: string): string {
  const authorStr = joinWith(
    names.map((n, i) => (i === 0 ? surnameFirst(n) : givenFirst(n))),
    // Chicago keeps the comma before 'and' even with two authors, because
    // the first name is inverted.
    ', and '
  )
  const where = issue ? ` ${issue.volume}, no. ${issue.number} (${issue.year})` : ''
  return `${authorStr}${authorStr.endsWith('.') ? '' : '.'} “${article.title}.” ${journal.name}${where}. ${url}.`
}

function formatHarvard(article: Article, names: CitedName[], issue: Issue | undefined, url: string): string {
  const authorStr = joinWith(names.map(surnameInitials), ' and ')
  const where = issue ? `, ${issue.volume}(${issue.number})` : ''
  return `${authorStr} (${issue?.year ?? 'n.d.'}) ‘${article.title}’, ${journal.name}${where}. Available at: ${url}.`
}

// BibTeX reads { } as grouping and \ as a command, so neither can appear
// unescaped in a value.
function bibValue(value: string): string {
  return value.replace(/[\\{}]/g, '').replace(/([&%$#_])/g, '\\$1')
}

function formatBibtex(article: Article, names: CitedName[], issue: Issue | undefined, url: string): string {
  const key =
    `${names[0]?.surname ?? 'article'}${issue?.year ?? ''}`.normalize('NFD').replace(/[^A-Za-z0-9]/g, '') || 'article'
  const fields: [string, string | number | undefined][] = [
    ['author', names.map(surnameFirst).join(' and ')],
    ['title', article.title],
    ['journal', journal.name],
    ['year', issue?.year],
    ['volume', issue?.volume],
    ['number', issue?.number],
    ['url', url],
  ]
  const lines = fields
    .filter(([, value]) => value !== undefined && value !== '')
    // The URL is left as typed: escaping its _ and % would break the link.
    .map(([name, value]) => `  ${name} = {${name === 'url' ? value : bibValue(String(value))}}`)
  return `@article{${key},\n${lines.join(',\n')}\n}`
}

// RIS — the import format EndNote, Zotero and Mendeley all read.
function formatRis(article: Article, names: CitedName[], issue: Issue | undefined, url: string): string {
  const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim()
  const lines = [
    'TY  - JOUR',
    ...names.map((n) => `AU  - ${surnameFirst(n)}`),
    `TI  - ${oneLine(article.title)}`,
    `JO  - ${journal.name}`,
    ...(issue ? [`PY  - ${issue.year}`, `VL  - ${issue.volume}`, `IS  - ${issue.number}`] : []),
    ...(article.abstract ? [`AB  - ${oneLine(article.abstract)}`] : []),
    ...article.keywords.map((k) => `KW  - ${oneLine(k)}`),
    `UR  - ${url}`,
    'ER  - ',
  ]
  return lines.join('\r\n') + '\r\n'
}

export interface ArticleCitations {
  apa: string
  mla: string
  chicago: string
  harvard: string
  bibtex: string
  ris: string
}

// Every citation style the article page offers, for one article. `url` is
// the article's public address.
export function formatCitations(article: Article, authors: Author[], issue: Issue | undefined, url: string): ArticleCitations {
  const names = authors.map((a) => parseName(a.name))
  return {
    apa: formatApaCitation(article, authors, issue, url),
    mla: formatMla(article, names, issue, url),
    chicago: formatChicago(article, names, issue, url),
    harvard: formatHarvard(article, names, issue, url),
    bibtex: formatBibtex(article, names, issue, url),
    ris: formatRis(article, names, issue, url),
  }
}
