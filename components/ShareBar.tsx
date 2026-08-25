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

export default function ShareBar({ title }: { title: string }) {
  const shareText = encodeURIComponent(title)
  return (
    <div className="flex items-center gap-4 py-3 border-y border-slate-200">
      <span className="kicker text-slate-500">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <XGlyph />
      </a>
      <a
        href="https://www.facebook.com/sharer/sharer.php"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <FacebookGlyph />
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <LinkedInGlyph />
      </a>
    </div>
  )
}
