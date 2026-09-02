'use client'

import { useEffect, useState } from 'react'
import type { UserRole } from '@/lib/types'
import { AdminHeading, ErrorBanner, inputClass } from './AdminUI'

interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  author_id: string | null
  created_at: string
}

const ROLES: UserRole[] = ['reader', 'author', 'editor', 'admin']

// Only rendered for admins (AdminGate + the /admin/users nav item are
// both gated on role === 'admin'), but the real enforcement is server
// side — /api/admin/users checks the caller's own role again before
// returning anything, since a client-side gate is just UX.
export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  function load() {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setUsers(data.users)
        }
        setLoaded(true)
      })
      .catch(() => {
        setError('Failed to load users.')
        setLoaded(true)
      })
  }

  useEffect(load, [])

  async function handleRoleChange(id: string, role: UserRole) {
    setSavingId(id)
    setError(null)
    const prev = users
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)))

    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    setSavingId(null)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Failed to update role.')
      setUsers(prev)
    }
  }

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return u.email.toLowerCase().includes(q) || (u.full_name ?? '').toLowerCase().includes(q)
  })

  return (
    <div>
      <AdminHeading title="Users & Roles" description="Grant editorial access, or promote a claimed author to editor." />
      <ErrorBanner message={error} />

      <input
        className={`${inputClass} max-w-sm mb-5`}
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {!loaded ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500 text-sm">No matching users.</p>
      ) : (
        <div className="border border-slate-200 divide-y divide-slate-200">
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-royal-blue truncate">{u.full_name || 'Unnamed'}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{u.id}</p>
              </div>
              <select
                value={u.role}
                disabled={savingId === u.id}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                className="border border-slate-300 px-2 py-1.5 text-sm shrink-0 disabled:opacity-60"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
