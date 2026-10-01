'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// Minimal generic glyphs for social share targets (lucide-react no longer ships brand icons).
function XGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-7l-5.5-6.8L4.2 22H1l8.2-9.3L1 2h7.2l5 6.2L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z" />
    </svg>
  )
}
function FacebookGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M14 8.5h2.5V5.3c-.4-.05-1.9-.18-3.6-.18-3.6 0-6 2.2-6 6.2v3.2H3.5V18h3.4v9h3.9v-9H14l.6-3.5h-3.7v-2.8c0-1 .3-1.7 1.8-1.7Z" transform="translate(0 -1)" />
    </svg>
  )
}
function LinkedInGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  )
}
function WhatsAppGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.1-.5.12-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.3c-.22.25-.86.85-.86 2.06s.88 2.39 1 2.55c.13.17 1.74 2.65 4.2 3.72.6.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.3Z" />
    </svg>
  )
}

const linkClass = 'text-slate-500 hover:text-royal-blue transition-colors'

// `url` is the article's canonical public address, passed in by the page
// rather than read from window.location: the share links are rendered
// into the statically generated HTML, and the address bar could also
// carry stray query params (?donation=thanks) that shouldn't be shared.
export default function ShareBar({ title, url }: { title: string; url: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const shareText = encodeURIComponent(title)
  const shareUrl = encodeURIComponent(url)

  function handleCopy() {
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-4 py-3 border-y border-slate-200">
      <span className="kicker text-slate-500">{t.article.share}</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.article.shareOnX}
        className={linkClass}
      >
        <XGlyph />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.article.shareOnFacebook}
        className={linkClass}
      >
        <FacebookGlyph />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.article.shareOnLinkedIn}
        className={linkClass}
      >
        <LinkedInGlyph />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.article.shareOnWhatsApp}
        className={linkClass}
      >
        <WhatsAppGlyph />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t.article.copyLink}
        className={`inline-flex items-center gap-1.5 text-xs ${linkClass}`}
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
        {copied ? t.article.linkCopied : t.article.copyLink}
      </button>
    </div>
  )
}
