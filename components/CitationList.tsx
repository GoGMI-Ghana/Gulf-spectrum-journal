'use client'

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'
import CitationRow from './CitationRow'

interface Row {
  slug: string
  title: string
  citation: string
  authorNames: string
  topicLabel?: string
  issueLabel?: string
}

// Lower-cased and with accents removed, so "andre" finds "André".
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// The Citations page's list, with a box that narrows it as you type. The
// whole list is already on the page, so this filters it in the browser —
// every word typed has to appear somewhere in an entry.
export default function CitationList({ rows }: { rows: Row[] }) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const words = fold(query).split(/\s+/).filter(Boolean)
  const shown = rows.filter((row) => {
    const haystack = fold([row.title, row.authorNames, row.topicLabel, row.issueLabel, row.citation].filter(Boolean).join(' '))
    return words.every((word) => haystack.includes(word))
  })

  return (
    <div>
      <div className="flex items-center border border-slate-300 focus-within:border-royal-blue mb-8">
        <SearchIcon size={16} className="text-slate-400 ml-4 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.citations.searchPlaceholder}
          aria-label={t.citations.searchPlaceholder}
          className="w-full px-3 py-3 text-base focus:outline-none"
        />
      </div>

      {shown.length === 0 && <p className="text-slate-600">{fmt(t.citations.noMatches, { query: query.trim() })}</p>}
      <div className="space-y-5">
        {shown.map((row) => (
          <CitationRow key={row.slug} {...row} />
        ))}
      </div>
    </div>
  )
}
