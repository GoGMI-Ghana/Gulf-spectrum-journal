import { createContext, useContext, useEffect, useState } from 'react'

const BookmarksContext = createContext(null)
const STORAGE_KEY = 'gsj-bookmarks'

function readStoredBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(readStoredBookmarks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  function toggleBookmark(slug) {
    setBookmarks((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  function isBookmarked(slug) {
    return bookmarks.includes(slug)
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks must be used within a BookmarksProvider')
  return ctx
}
