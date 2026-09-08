'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeading } from './AdminUI'

interface MessageRow {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read_at: string | null
  created_at: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  function load() {
    const supabase = createClient()
    supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, read_at, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Failed to load contact messages', error)
        else setMessages(data as MessageRow[])
        setLoaded(true)
      })
  }

  useEffect(load, [])

  async function handleOpen(m: MessageRow) {
    setOpenId(openId === m.id ? null : m.id)
    if (!m.read_at) {
      const supabase = createClient()
      const readAt = new Date().toISOString()
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read_at: readAt } : x)))
      await supabase.from('contact_messages').update({ read_at: readAt }).eq('id', m.id)
    }
  }

  const unreadCount = messages.filter((m) => !m.read_at).length

  return (
    <div>
      <AdminHeading title="Messages" description={`From the Contact page. ${unreadCount} unread.`} />

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-slate-500 text-sm">No messages yet.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {messages.map((m) => {
            const isOpen = openId === m.id
            return (
              <div key={m.id}>
                <button onClick={() => handleOpen(m)} className="w-full text-left flex items-start justify-between gap-4 px-4 py-3 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${m.read_at ? 'text-slate-700' : 'font-semibold text-royal-blue'}`}>
                      {m.subject}
                      {!m.read_at && <span className="ml-2 w-2 h-2 rounded-full bg-gold inline-block align-middle" />}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-200 p-3">{m.message}</p>
                    <a href={`mailto:${m.email}`} className="inline-block mt-2 text-sm text-ocean-blue hover:underline">
                      Reply by email →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
