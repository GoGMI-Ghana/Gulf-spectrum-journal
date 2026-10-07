'use client'

import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import type { ArticleCitations } from '@/lib/citation'

// Style names are proper nouns, the same in every language.
const STYLES = [
  { key: 'apa', label: 'APA' },
  { key: 'mla', label: 'MLA' },
  { key: 'chicago', label: 'Chicago' },
  { key: 'harvard', label: 'Harvard' },
  { key: 'bibtex', label: 'BibTeX' },
] as const

type StyleKey = (typeof STYLES)[number]['key']

export default function CiteBox({ citations, slug }: { citations: ArticleCitations; slug: string }) {
  const [style, setStyle] = useState<StyleKey>('apa')
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()
  const citation = citations[style]

  function handleCopy() {
    navigator.clipboard?.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Saves a file a reference manager can import, built in the browser
  // from text the page already has.
  function download(content: string, extension: string, type: string) {
    const href = URL.createObjectURL(new Blob([content], { type }))
    const link = document.createElement('a')
    link.href = href
    link.download = `${slug}.${extension}`
    link.click()
    URL.revokeObjectURL(href)
  }

  return (
    <div className="border-l-4 border-royal-blue bg-slate-50 p-6 mb-8">
      <h2 className="kicker text-royal-blue mb-3">{t.article.citeHeading}</h2>
      <div role="group" aria-label={t.article.citeStyle} className="flex flex-wrap gap-1.5 mb-3">
        {STYLES.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={style === s.key}
            onClick={() => {
              setStyle(s.key)
              setCopied(false)
            }}
            className={`text-xs font-medium px-2.5 py-1 border transition-colors ${
              style === s.key
                ? 'bg-royal-blue border-royal-blue text-white'
                : 'bg-white border-slate-300 text-slate-600 hover:border-royal-blue hover:text-royal-blue'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed mb-3 font-mono whitespace-pre-wrap break-words">{citation}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-blue hover:underline"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? t.common.copied : t.common.copyCitation}
        </button>
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <Download size={15} />
          {t.article.citeExport}
          <button
            type="button"
            onClick={() => download(citations.ris, 'ris', 'application/x-research-info-systems')}
            className="font-medium text-ocean-blue hover:underline"
          >
            RIS
          </button>
          <button
            type="button"
            onClick={() => download(citations.bibtex, 'bib', 'application/x-bibtex')}
            className="font-medium text-ocean-blue hover:underline"
          >
            BibTeX
          </button>
        </span>
      </div>
    </div>
  )
}
