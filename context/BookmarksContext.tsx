'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'

interface BookmarksContextValue {
  bookmarks: string[]
  toggleBookmark: (slug: string) => void
  isBookmarked: (slug: string) => boolean
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null)
const STORAGE_KEY = 'gsj-bookmarks'

// A tiny external store over localStorage, read via useSyncExternalStore —
// the React-recommended way to read a client-only source (window isn't
// available during SSR) without the hydration-mismatch or
// setState-in-effect problems a useState + useEffect version runs into.
const EMPTY: string[] = []
let cached: string[] = EMPTY
let hydrated = false
const listeners = new Set<() => void>()

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function subscribe(onStoreChange: () => void) {
  if (!hydrated) {
    cached = readFromStorage()
    hydrated = true
  }
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getSnapshot() {
  return cached
}

function getServerSnapshot() {
  return EMPTY
}

function setBookmarks(next: string[]) {
  cached = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggleBookmark(slug: string) {
    setBookmarks(bookmarks.includes(slug) ? bookmarks.filter((s) => s !== slug) : [...bookmarks, slug])
  }

  function isBookmarked(slug: string) {
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
