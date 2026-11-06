'use client'

import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

// The translated "Issue N" label on article cards. Split out as its own
// tiny Client Component so ArticleCardView itself can stay hook-free: it's
// rendered from Server Components with the full article object, and making
// it a Client Component would serialize every card's entire article body
// into the page payload just to read one label.
export default function ArticleKicker({ issueNumber }: { issueNumber: number }) {
  const { t } = useI18n()
  return <>{fmt(t.common.issueNumber, { number: issueNumber })}</>
}
