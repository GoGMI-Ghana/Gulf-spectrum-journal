'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { useAccount } from '@/context/AccountContext'

export default function BookmarkButton({
  slug,
  className = '',
  showLabel = false,
}: {
  slug: string
  className?: string
  showLabel?: boolean
}) {
  const { user, isBookmarked, toggleBookmark } = useAccount()
  const pathname = usePathname()
  const active = isBookmarked(slug)

  // Bookmarks are tied to an account now (see AccountContext) — signed
  // out, there's nothing to toggle, so this becomes a link to sign in
  // (with a redirect back here) instead of a doomed write RLS would
  // reject anyway.
  if (!user) {
    return (
      <Link
        href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
        className={`inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-royal-blue transition-colors ${className}`}
        aria-label="Sign in to bookmark this article"
      >
        <Bookmark size={16} />
        {showLabel && <span>Sign in to bookmark</span>}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleBookmark(slug)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove bookmark' : 'Bookmark this article'}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
        active ? 'text-gold' : 'text-slate-400 hover:text-royal-blue'
      } ${className}`}
    >
      <Bookmark size={16} fill={active ? 'currentColor' : 'none'} />
      {showLabel && <span>{active ? 'Bookmarked' : 'Bookmark'}</span>}
    </button>
  )
}
