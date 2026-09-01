'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Send, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'
import Initials from './Initials'

interface OtherUser {
  id: string
  fullName: string | null
}

interface ConversationSummary {
  id: string
  otherUser: OtherUser
  lastMessageAt: string
}

interface MessageRow {
  id: number
  senderId: string
  body: string
  createdAt: string
  readAt: string | null
}

interface ProfileSearchResult {
  id: string
  fullName: string | null
}

// Unwraps a PostgREST embed that's typed as an array even for a
// many-to-one relation (no generated DB types to tell the query builder
// otherwise) — same situation as bookmarks' and notifications' embeds.
function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

function displayName(user: OtherUser | ProfileSearchResult): string {
  return user.fullName || 'Unnamed reader'
}

// A single template literal (no runtime concatenation) so supabase-js's
// type-level select-string parser can actually infer the embedded
// user_a/user_b shape — building this via `+` between string literals
// loses the literal type and the response comes back typed as an opaque
// error object instead.
const CONVERSATION_SELECT = `
  id, user_a_id, user_b_id, last_message_at,
  user_a:profiles!conversations_user_a_id_fkey(id, full_name),
  user_b:profiles!conversations_user_b_id_fkey(id, full_name)
`

export default function MessagesApp() {
  const { user, authLoading, refreshUnreadMessages } = useAccount()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [conversationsLoaded, setConversationsLoaded] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  // Which conversation `messages` actually holds — compared against
  // selectedId below to derive what's shown, rather than a synchronous
  // setMessages([]) when switching conversations or deselecting (same
  // "derive, don't reset" reasoning as AccountContext's bookmarks/
  // notifications state). Prevents a real bug too: without this, briefly
  // showing conversation A's messages under conversation B's header while
  // B's fetch is still in flight.
  const [messagesForConversationId, setMessagesForConversationId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([])
  // Same reasoning: which query `searchResults` answers, derived against
  // the live searchQuery below instead of a synchronous reset — this also
  // stands in for a loading flag (searching = query pending an answer),
  // rather than a separate setSearching(true) at the top of the effect.
  const [searchResultsForQuery, setSearchResultsForQuery] = useState<string | null>(null)
  const threadEndRef = useRef<HTMLDivElement>(null)

  // Conversation list: loaded once per signed-in user, refreshed after
  // starting a new one. Two embeds of the same profiles table (conversations
  // has two FKs into it) need the explicit constraint-name hints below —
  // PostgREST can't otherwise tell user_a from user_b.
  async function loadConversations() {
    if (!user) return
    const supabase = createClient()
    const { data, error } = await supabase
      .from('conversations')
      .select(CONVERSATION_SELECT)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Failed to load conversations', error)
      setConversationsLoaded(true)
      return
    }

    const rows: ConversationSummary[] = (data ?? []).map((row) => {
      const userA = one(row.user_a as { id: string; full_name: string | null } | { id: string; full_name: string | null }[] | null)
      const userB = one(row.user_b as { id: string; full_name: string | null } | { id: string; full_name: string | null }[] | null)
      const other = row.user_a_id === user.id ? userB : userA
      return {
        id: row.id,
        lastMessageAt: row.last_message_at,
        otherUser: { id: other?.id ?? '', fullName: other?.full_name ?? null },
      }
    })
    setConversations(rows)
    setConversationsLoaded(true)
  }

  // Duplicates loadConversations' query rather than calling it directly:
  // react-hooks/set-state-in-effect only treats a setState as safe when
  // it's inside a .then() callback written directly in the effect body,
  // not one reached by calling a separately defined function — even
  // though loadConversations is just as safe internally. loadConversations
  // itself stays around for startConversation's reuse below (an event
  // handler, not an effect, so that call site isn't subject to the rule).
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('conversations')
      .select(CONVERSATION_SELECT)
      .order('last_message_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load conversations', error)
          setConversationsLoaded(true)
          return
        }
        const rows: ConversationSummary[] = (data ?? []).map((row) => {
          const userA = one(row.user_a as { id: string; full_name: string | null } | { id: string; full_name: string | null }[] | null)
          const userB = one(row.user_b as { id: string; full_name: string | null } | { id: string; full_name: string | null }[] | null)
          const other = row.user_a_id === user.id ? userB : userA
          return {
            id: row.id,
            lastMessageAt: row.last_message_at,
            otherUser: { id: other?.id ?? '', fullName: other?.full_name ?? null },
          }
        })
        setConversations(rows)
        setConversationsLoaded(true)
      })
  }, [user])

  // Selected conversation's messages, plus marking received ones read and
  // a realtime subscription so replies show up without a reload. No early
  // return + reset for the "nothing selected" case — see
  // messagesForConversationId above for why.
  useEffect(() => {
    if (!selectedId || !user) return
    let cancelled = false
    const supabase = createClient()

    supabase
      .from('messages')
      .select('id, sender_id, body, created_at, read_at')
      .eq('conversation_id', selectedId)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load messages', error)
          return
        }
        const rows = (data ?? []).map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          body: m.body,
          createdAt: m.created_at,
          readAt: m.read_at,
        }))
        setMessages(rows)
        setMessagesForConversationId(selectedId)

        const unreadIds = rows.filter((m) => !m.readAt && m.senderId !== user.id).map((m) => m.id)
        if (unreadIds.length > 0) {
          await supabase.from('messages').update({ read_at: new Date().toISOString() }).in('id', unreadIds)
          refreshUnreadMessages()
        }
      })

    const channel = supabase
      .channel(`messages-${selectedId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          const m = payload.new as { id: number; sender_id: string; body: string; created_at: string; read_at: string | null }
          setMessages((prev) => (prev.some((existing) => existing.id === m.id) ? prev : [...prev, { id: m.id, senderId: m.sender_id, body: m.body, createdAt: m.created_at, readAt: m.read_at }]))
          if (m.sender_id !== user.id) {
            supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', m.id).then(() => refreshUnreadMessages())
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, user])

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body || !selectedId || !user) return
    setSending(true)
    setDraft('')
    const supabase = createClient()
    const { error } = await supabase.from('messages').insert({ conversation_id: selectedId, sender_id: user.id, body })
    setSending(false)
    if (error) {
      console.error('Failed to send message', error)
      setDraft(body)
      return
    }
    // The sent message itself isn't appended here — it arrives back
    // through the realtime subscription above (we're a subscriber on our
    // own conversation too), which is also what de-dupes it if both that
    // and this code path somehow raced. Just bump the conversation to the
    // top of the list.
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === selectedId)
      if (idx === -1) return prev
      const updated = { ...prev[idx], lastMessageAt: new Date().toISOString() }
      return [updated, ...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }

  const trimmedQuery = searchQuery.trim()

  useEffect(() => {
    if (!searchOpen || trimmedQuery.length < 2 || !user) return
    let cancelled = false
    const supabase = createClient()
    const timeout = setTimeout(() => {
      supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${trimmedQuery}%`)
        .neq('id', user.id)
        .limit(10)
        .then(({ data, error }) => {
          if (cancelled) return
          if (error) {
            console.error('Failed to search members', error)
            setSearchResults([])
          } else {
            setSearchResults((data ?? []).map((p) => ({ id: p.id, fullName: p.full_name })))
          }
          setSearchResultsForQuery(trimmedQuery)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [trimmedQuery, searchOpen, user])

  async function startConversation(otherUserId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_or_create_conversation', { other_user_id: otherUserId })
    if (error || !data) {
      console.error('Failed to start conversation', error)
      return
    }
    setSearchOpen(false)
    setSearchQuery('')
    setSelectedId(data as string)
    await loadConversations()
  }

  if (authLoading) {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href="/sign-in?redirect=/messages" className="text-ocean-blue hover:underline">
          Sign in
        </Link>{' '}
        to send and receive messages.
      </p>
    )
  }

  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const visibleMessages = selectedId && messagesForConversationId === selectedId ? messages : []
  const searching = searchOpen && trimmedQuery.length >= 2 && searchResultsForQuery !== trimmedQuery
  const visibleSearchResults = searchOpen && searchResultsForQuery === trimmedQuery ? searchResults : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] border border-slate-200 h-[70vh] min-h-[480px]">
      {/* Conversation list */}
      <div className={`border-r border-slate-200 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 border-b border-slate-200">
          {searchOpen ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members by name…"
                  className="flex-1 border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:border-royal-blue"
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-slate-400 hover:text-royal-blue">
                  <X size={16} />
                </button>
              </div>
              {searching && <p className="text-xs text-slate-400 px-1">Searching…</p>}
              {!searching && trimmedQuery.length >= 2 && visibleSearchResults.length === 0 && (
                <p className="text-xs text-slate-400 px-1">No members found.</p>
              )}
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {visibleSearchResults.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => startConversation(r.id)}
                      className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-left hover:bg-soft-gold/40"
                    >
                      <Initials name={displayName(r)} size="sm" />
                      <span className="text-royal-blue">{displayName(r)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-royal-blue hover:bg-ocean-blue text-white text-sm font-semibold px-3 py-2 transition-colors"
            >
              <Search size={14} /> New Message
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {!conversationsLoaded && <p className="text-sm text-slate-400 p-4">Loading…</p>}
          {conversationsLoaded && conversations.length === 0 && (
            <p className="text-sm text-slate-500 p-4">
              No conversations yet. Use &ldquo;New Message&rdquo; to find another member.
            </p>
          )}
          <ul>
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-slate-100 hover:bg-soft-gold/30 ${
                    c.id === selectedId ? 'bg-soft-gold/40' : ''
                  }`}
                >
                  <Initials name={displayName(c.otherUser)} size="sm" />
                  <span className="text-sm text-royal-blue font-medium truncate">{displayName(c.otherUser)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Thread */}
      <div className={`flex flex-col ${selectedId ? 'flex' : 'hidden md:flex'}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 p-6 text-center">
            Select a conversation, or start a new one.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
              <button onClick={() => setSelectedId(null)} className="md:hidden text-slate-400 hover:text-royal-blue text-sm">
                ← Back
              </button>
              <Initials name={displayName(selected.otherUser)} size="sm" />
              <span className="font-semibold text-royal-blue text-sm">{displayName(selected.otherUser)}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {visibleMessages.map((m) => {
                const mine = m.senderId === user.id
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 text-sm ${
                        mine ? 'bg-royal-blue text-white' : 'bg-slate-100 text-ink'
                      }`}
                    >
                      <p className="whitespace-pre-line break-words">{m.body}</p>
                      <p className={`text-[10px] mt-1 ${mine ? 'text-white/60' : 'text-slate-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={threadEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-slate-200">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                aria-label="Send message"
                className="bg-royal-blue hover:bg-ocean-blue text-white p-2.5 transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
