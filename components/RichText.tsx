import { looksLikeHtml } from '@/lib/richText'
import { sanitizeArticleHtml } from '@/lib/sanitizeArticleHtml'

// Renders an article's section body or conclusion. Server Component: the
// HTML is sanitized here, at page-generation time, so neither the
// sanitizer nor any unsanitized markup ever reaches the browser. Typography
// comes from .article-body in globals.css (shared with the admin editor,
// so what an editor sees is what readers get).
export default function RichText({ value }: { value: string }) {
  // Plain text from before the rich-text editor existed.
  if (!looksLikeHtml(value)) {
    return <p className="text-slate-700 leading-relaxed whitespace-pre-line">{value}</p>
  }
  return <div className="article-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(value) }} />
}
