'use client'

// Real photography from GoGMI's own Maritime Security Conference, used as
// the issue's cover image — with a bottom scrim so the issue number and
// title stay readable over whatever is in the shot.

import Image from 'next/image'
import type { Issue } from '@/lib/types'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

// A Client Component only for the translated alt text.
export default function IssueCover({ issue, className = '' }: { issue: Issue; className?: string }) {
  const { t } = useI18n()
  return (
    <div className={`relative aspect-[3/4] overflow-hidden bg-royal-blue ${className}`}>
      <Image
        src={issue.coverImage}
        alt={fmt(t.issue.coverAlt, { number: issue.number, theme: issue.theme })}
        fill
        sizes="(max-width: 768px) 40vw, 220px"
        className="object-cover"
      />
      <div
        className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3"
        style={{ background: 'linear-gradient(to top, rgba(0,10,25,0.92), rgba(0,10,25,0.55) 60%, transparent)' }}
      >
        <p className="numeral text-gold font-bold text-lg leading-none mb-1">N°{issue.number}</p>
        <p className="text-white text-[11px] leading-snug line-clamp-2">{issue.theme}</p>
      </div>
    </div>
  )
}
