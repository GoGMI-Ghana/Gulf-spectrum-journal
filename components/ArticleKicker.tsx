'use client'

import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

// The translated "Research Article — Issue N" label on article cards. Split
// out as its own tiny Client Component so ArticleCardView itself can stay
// hook-free: it's rendered from Server Components with the full article
// object, and making it a Client Component would serialize every card's
// entire article body into the page payload just to read two labels.
export default function ArticleKicker({ issueNumber }: { issueNumber?: number }) {
  const { t } = useI18n()
  return (
    <>
      {t.common.researchArticle}
      {issueNumber != null && (
        <span className="text-slate-400 font-normal normal-case tracking-normal">
          {' '}
          — {fmt(t.common.issueNumber, { number: issueNumber })}
        </span>
      )}
    </>
  )
}
