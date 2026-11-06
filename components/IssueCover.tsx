'use client'

// An issue's cover. The real cover already carries the journal name and
// issue number, so it is shown as it is; an issue without one gets a plain
// royal-blue panel with the number and theme set on it.

import Image from 'next/image'
import type { Issue } from '@/lib/types'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

// A Client Component only for the translated alt text.
export default function IssueCover({
  issue,
  className = '',
  sizes = '(max-width: 768px) 40vw, 220px',
  priority = false,
}: {
  issue: Issue
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const { t } = useI18n()
  const alt = fmt(t.issue.coverAlt, { number: issue.number, theme: issue.theme })

  if (issue.coverImage) {
    return (
      <div className={`relative aspect-[1190/1683] overflow-hidden bg-royal-blue ${className}`}>
        <Image src={issue.coverImage} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative aspect-[1190/1683] overflow-hidden bg-royal-blue flex flex-col justify-end p-3 ${className}`}
    >
      <p className="font-display text-gold font-semibold text-lg leading-none mb-1">{issue.number}</p>
      <p className="text-white text-xs leading-snug line-clamp-3">{issue.theme}</p>
    </div>
  )
}
