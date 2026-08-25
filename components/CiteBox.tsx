'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CiteBox({ citation }: { citation: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-l-4 border-royal-blue bg-slate-50 p-6 mb-8">
      <h2 className="kicker text-royal-blue mb-3">Cite This Article</h2>
      <p className="text-sm text-slate-700 leading-relaxed mb-3 font-mono">{citation}</p>
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
