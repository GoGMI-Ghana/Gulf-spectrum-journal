'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'

export default function CitationRow({
  slug,
  title,
  citation,
  authorNames,
  topicLabel,
  issueLabel,
}: {
  slug: string
  title: string
  citation: string
  authorNames: string
  topicLabel?: string
  issueLabel?: string
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-slate-200 hover:border-royal-blue/40 transition-colors p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {topicLabel && (
          <span className="kicker text-royal-blue bg-soft-gold px-2 py-0.5">{topicLabel}</span>
        )}
        {issueLabel && <span className="text-xs text-slate-400">{issueLabel}</span>}
      </div>
      <Link href={`/articles/${slug}`} className="font-semibold text-royal-blue hover:text-ocean-blue">
        {title}
      </Link>
      <p className="text-xs text-slate-500 mt-1 mb-3">{authorNames}</p>
      <p className="text-sm text-slate-700 font-mono bg-slate-50 border-l-2 border-slate-300 px-3 py-2 mb-3">
        {citation}
      </p>
      <div className="flex items-center gap-5">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-blue hover:underline"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied' : 'Copy citation'}
        </button>
        <Link href={`/articles/${slug}`} className="text-sm font-medium text-slate-500 hover:text-royal-blue">
          View article →
        </Link>
      </div>
    </div>
  )
}
