'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'

export default function CitationRow({
  slug,
  title,
  citation,
}: {
  slug: string
  title: string
  citation: string
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-5 border-b border-slate-200">
      <Link href={`/articles/${slug}`} className="font-semibold text-royal-blue hover:text-ocean-blue">
        {title}
      </Link>
      <p className="text-sm text-slate-600 font-mono mt-2 mb-2">{citation}</p>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-blue hover:underline"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy citation'}
      </button>
    </div>
  )
}
