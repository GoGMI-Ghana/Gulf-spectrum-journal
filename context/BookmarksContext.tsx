'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CurrentUser } from '@/lib/types'

interface BookmarksContextValue {
  user: CurrentUser | null
  authLoading: boolean
  bookmarks: string[]
  bookmarksLoading: boolean
  toggleBookmark: (slug: string) => void
  isBookmarked: (slug: string) => boolean
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null)

function toCurrentUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): CurrentUser | null {
  if (!user) return null
  const fullName = user.user_metadata?.full_name
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: typeof fullName === 'string' && fullName.length > 0 ? fullName : null,
  }
}

// Bookmarks now live in the `bookmarks` table, scoped to the signed-in
// user by RLS (see gulf-spectrum-backend's migration) — not localStorage.
// That makes this provider entirely client-side rather than the
// useSyncExternalStore-over-localStorage version it replaced: it has to
// know who's signed in (via the browser Supabase client, which reads the
// session from cookies/local storage itself) and fetch that user's rows
// after mount. Deliberately not read server-side in the root layout — see
// the comment there.
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  // Whose bookmarks `bookmarks` actually holds — compared against the
  // current user below to derive a loading flag, rather than a separate
  // setBookmarksLoading(true) at the top of the effect (a synchronous
  // setState at the start of an effect body is exactly what
  // react-hooks/set-state-in-effect flags; every setState here happens
  // inside a callback instead — a promise resolution or an auth event).
  const [bookmarksForUserId, setBookmarksForUserId] = useState<string | null>(null)

  // Auth state: initial check, then stay in sync with sign-in/out
  // (including from the sign-in/sign-up forms, which use the same
  // browser client).
  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      setUser(toCurrentUser(data.user))
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toCurrentUser(session?.user ?? null))
      setAuthLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  // Bookmarks: (re)load whenever who's signed in changes. Signed out is
  // handled by deriving the exposed value below (`user ? bookmarks : []`)
  // rather than resetting state here — setting state synchronously in an
  // effect body for a case that doesn't need to subscribe to anything
  // external is exactly what react-hooks/set-state-in-effect flags.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('bookmarks')
      .select('article:articles(slug)')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load bookmarks', error)
          setBookmarks([])
        } else {
          // The query builder can't see the articles<->bookmarks foreign
          // key without generated DB types, so it infers `article` as an
          // array even though this is really a many-to-one join (each
          // bookmark row nests exactly one article). Handle both shapes
          // rather than fighting the inference with a brittle cast.
          const slugs = (data ?? [])
            .map((row) => {
              const article = row.article as { slug: string } | { slug: string }[] | null
              return Array.isArray(article) ? article[0]?.slug : article?.slug
            })
            .filter((s): s is string => Boolean(s))
          setBookmarks(slugs)
        }
        setBookmarksForUserId(user.id)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  async function toggleBookmark(slug: string) {
    if (!user) return
    const supabase = createClient()
    const alreadyBookmarked = bookmarks.includes(slug)

    // Optimistic update, reverted below if the write fails.
    setBookmarks((prev) => (alreadyBookmarked ? prev.filter((s) => s !== slug) : [...prev, slug]))

    const { data: article, error: lookupError } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (lookupError || !article) {
      console.error('Failed to resolve article for bookmark toggle', lookupError)
      setBookmarks((prev) => (alreadyBookmarked ? [...prev, slug] : prev.filter((s) => s !== slug)))
      return
    }

    const { error } = alreadyBookmarked
      ? await supabase.from('bookmarks').delete().eq('article_id', article.id)
      : await supabase.from('bookmarks').insert({ user_id: user.id, article_id: article.id })

    if (error) {
      console.error('Failed to save bookmark', error)
      setBookmarks((prev) => (alreadyBookmarked ? [...prev, slug] : prev.filter((s) => s !== slug)))
    }
  }

  // Both derived rather than tracked with their own setState calls (see
  // the effects above): visibleBookmarks resets to [] as soon as `user`
  // is null, without needing an explicit reset in the sign-out case;
  // bookmarksLoading is true exactly when `bookmarks` doesn't yet
  // correspond to the signed-in user (covers both "still fetching" and
  // "just switched accounts").
  const visibleBookmarks = user ? bookmarks : []
  const bookmarksLoading = Boolean(user) && bookmarksForUserId !== user?.id

  function isBookmarked(slug: string) {
    return visibleBookmarks.includes(slug)
  }

  return (
    <BookmarksContext.Provider
      value={{ user, authLoading, bookmarks: visibleBookmarks, bookmarksLoading, toggleBookmark, isBookmarked }}
    >
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks must be used within a BookmarksProvider')
  return ctx
}
