'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CurrentUser, UserRole } from '@/lib/types'

interface AccountContextValue {
  user: CurrentUser | null
  authLoading: boolean
  role: UserRole | null
  isEditor: boolean
  bookmarks: string[]
  bookmarksLoading: boolean
  toggleBookmark: (slug: string) => void
  isBookmarked: (slug: string) => boolean
  unreadNotifications: number
  markNotificationsRead: (ids: number[]) => void
  unreadMessages: number
  refreshUnreadMessages: () => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

function toCurrentUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): CurrentUser | null {
  if (!user) return null
  const fullName = user.user_metadata?.full_name
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: typeof fullName === 'string' && fullName.length > 0 ? fullName : null,
  }
}

// Everything about the signed-in visitor that more than one part of the UI
// needs: who they are, their bookmarked slugs (for the bookmark buttons
// everywhere and the header/sidebar badge), and their unread notification
// count (same badge pattern). All of it client-only — the browser Supabase
// client reads the session itself from cookies/local storage — rather than
// read server-side in the root layout: cookies() anywhere in that tree
// would force every route dynamic, undoing static generation for all the
// content pages. Was called BookmarksContext until notifications made that
// name inaccurate; this is really "the signed-in account", not one feature
// of it.
export function AccountProvider({ children }: { children: ReactNode }) {
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
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadForUserId, setUnreadForUserId] = useState<string | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadMessagesForUserId, setUnreadMessagesForUserId] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [roleForUserId, setRoleForUserId] = useState<string | null>(null)

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

  // Unread notification count — same load-on-user-change pattern as
  // bookmarks above. The notifications page fetches the full list itself
  // (only needed in one place); this is just the badge count.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .is('read_at', null)
      .then(({ count, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load unread notification count', error)
          setUnreadNotifications(0)
        } else {
          setUnreadNotifications(count ?? 0)
        }
        setUnreadForUserId(user.id)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  // Unread DM count — unlike notifications, this needs to be re-fetchable
  // on demand (refreshUnreadMessages below), not just loaded once per
  // user: new messages can arrive while the message thread itself is
  // open (handled there via realtime) and the badge needs to catch up
  // without waiting for a full remount. The query is duplicated between
  // the effect and refreshUnreadMessages rather than shared through a
  // named helper: react-hooks/set-state-in-effect only recognizes a
  // setState call as safe when it's directly inside a .then() callback
  // written in the effect body, not one reached by calling a separately
  // defined function (even though that function is just as safe) — same
  // reasoning as the bookmarks/notifications effects above.
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .is('read_at', null)
      .neq('sender_id', user.id)
      .then(({ count, error }) => {
        if (error) {
          console.error('Failed to load unread message count', error)
          setUnreadMessages(0)
        } else {
          setUnreadMessages(count ?? 0)
        }
        setUnreadMessagesForUserId(user.id)
      })
  }, [user])

  // Editorial role — same load-on-user-change pattern as bookmarks/
  // notifications above. Read once per session rather than re-checked per
  // /admin page, since a role change (granted by another admin) only
  // takes effect on this user's next sign-in anyway — profiles.role isn't
  // realtime-subscribed here.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load account role', error)
          setRole(null)
        } else {
          setRole((data?.role as UserRole | undefined) ?? null)
        }
        setRoleForUserId(user.id)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  function refreshUnreadMessages() {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .is('read_at', null)
      .neq('sender_id', user.id)
      .then(({ count, error }) => {
        if (!error) setUnreadMessages(count ?? 0)
      })
  }

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

  // Called by the notifications page after marking rows read there — kept
  // here (rather than each page doing its own write) so the header/sidebar
  // badge updates in the same action instead of waiting for a refetch.
  async function markNotificationsRead(ids: number[]) {
    if (!user || ids.length === 0) return
    const supabase = createClient()
    setUnreadNotifications((n) => Math.max(0, n - ids.length))
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .in('id', ids)
      .is('read_at', null)
    if (error) {
      console.error('Failed to mark notifications read', error)
      setUnreadNotifications((n) => n + ids.length)
    }
  }

  // All three derived rather than reset via setState when signed out (see
  // the effects above) — stale rows from a previous session just sit
  // unused until the next successful fetch overwrites them.
  const visibleBookmarks = user ? bookmarks : []
  const bookmarksLoading = Boolean(user) && bookmarksForUserId !== user?.id
  const visibleUnreadNotifications = user && unreadForUserId === user.id ? unreadNotifications : 0
  const visibleUnreadMessages = user && unreadMessagesForUserId === user.id ? unreadMessages : 0
  const visibleRole = user && roleForUserId === user.id ? role : null
  const isEditor = visibleRole === 'editor' || visibleRole === 'admin'

  function isBookmarked(slug: string) {
    return visibleBookmarks.includes(slug)
  }

  return (
    <AccountContext.Provider
      value={{
        user,
        authLoading,
        role: visibleRole,
        isEditor,
        bookmarks: visibleBookmarks,
        bookmarksLoading,
        toggleBookmark,
        isBookmarked,
        unreadNotifications: visibleUnreadNotifications,
        markNotificationsRead,
        unreadMessages: visibleUnreadMessages,
        refreshUnreadMessages,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within an AccountProvider')
  return ctx
}
