import { journal } from './content'
import type { Article, Author, Issue } from './types'

const TITLE_PREFIX = /^(?:(?:Dr|Prof|Capt|Cdr|Lt|Sub-Lt)\.\s+|Rear Admiral \(Rtd\)\s+)+/

function citationName(name: string): string {
  const cleaned = name.replace(TITLE_PREFIX, '')
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length < 2) return cleaned
  const surname = parts[parts.length - 1]
  const initials = parts.slice(0, -1).map((p) => `${p[0].toUpperCase()}.`).join(' ')
  return `${surname}, ${initials}`
}

export function formatApaCitation(article: Article, authors: Author[], issue: Issue | undefined): string {
  const names = authors.map((a) => citationName(a.name))
  const authorStr =
    names.length > 1 ? `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}` : (names[0] ?? '')
  const year = issue?.year ?? ''
  const vol = issue?.volume ?? ''
  const num = issue?.number ?? ''
  return `${authorStr} (${year}). ${article.title}. ${journal.name}, ${vol}(${num}).`
}
