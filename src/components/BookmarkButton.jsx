import { Bookmark } from 'lucide-react'
import { useBookmarks } from '../context/BookmarksContext'

export default function BookmarkButton({ slug, className = '', showLabel = false }) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const active = isBookmarked(slug)

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
