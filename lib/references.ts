// Reference-list entries are plain text. These find the web addresses and
// DOIs inside one, so the article page and PDF can make them links and the
// Crossref deposit can tell Crossref which DOI a reference cites.
import { doiUrl } from './doi'

export interface ReferencePart {
  text: string
  href?: string
}

// A web address, or a bare DOI ("DOI: 10.1080/…") not already part of one.
const LINK = /https?:\/\/[^\s<>"]+|(?<![\w/.])10\.\d{4,9}\/[^\s<>"]+/g
// Punctuation that ends the sentence rather than the address.
const TRAILING = /[.,;:)\]]+$/

export function referenceParts(reference: string): ReferencePart[] {
  const parts: ReferencePart[] = []
  let last = 0
  for (const match of reference.matchAll(LINK)) {
    const link = match[0].replace(TRAILING, '')
    const start = match.index
    if (start > last) parts.push({ text: reference.slice(last, start) })
    parts.push({ text: link, href: link.startsWith('10.') ? doiUrl(link) : link })
    last = start + link.length
  }
  if (last < reference.length) parts.push({ text: reference.slice(last) })
  return parts
}

// The DOI a reference cites, or undefined if it has none or names more than
// one work.
export function referenceDoi(reference: string): string | undefined {
  const dois = new Set(
    [...reference.matchAll(/10\.\d{4,9}\/[^\s<>"]+/g)].map((m) => m[0].replace(TRAILING, '').toLowerCase())
  )
  return dois.size === 1 ? [...dois][0] : undefined
}
