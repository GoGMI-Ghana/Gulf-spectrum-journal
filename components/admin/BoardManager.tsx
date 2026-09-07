'use client'

import { useEffect, useState } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { AdminHeading, ErrorBanner, Field, inputClass, primaryButtonClass, secondaryButtonClass } from './AdminUI'

type AppStatus = 'pending' | 'approved' | 'declined'

interface Member {
  id: string
  fullName: string | null
  email: string
  title: string
  role: string
}

interface Application {
  id: string
  userId: string
  fullName: string | null
  email: string
  statement: string
  status: AppStatus
  createdAt: string
  reviewedAt: string | null
}

interface DirectoryUser {
  id: string
  email: string
  full_name: string | null
}

const STATUS_STYLE: Record<AppStatus, string> = {
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  approved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  declined: 'text-red-700 bg-red-50 border-red-200',
}

export default function BoardManager() {
  const [members, setMembers] = useState<Member[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [users, setUsers] = useState<DirectoryUser[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [approveTitleFor, setApproveTitleFor] = useState<string | null>(null)
  const [approveTitle, setApproveTitle] = useState('Editorial Board Member')

  const [addUserId, setAddUserId] = useState('')
  const [addTitle, setAddTitle] = useState('')

  function load() {
    Promise.all([fetch('/api/admin/board').then((r) => r.json()), fetch('/api/admin/users').then((r) => r.json())]).then(
      ([boardData, usersData]) => {
        if (boardData.error) setError(boardData.error)
        else {
          setMembers(boardData.members)
          setApplications(boardData.applications)
        }
        if (!usersData.error) setUsers(usersData.users)
        setLoaded(true)
      }
    )
  }

  useEffect(load, [])

  async function handleDecide(app: Application, decision: 'approved' | 'declined', title?: string) {
    setBusyId(app.id)
    setError(null)
    const res = await fetch(`/api/admin/board/applications/${app.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, title }),
    })
    setBusyId(null)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Failed to record decision.')
      return
    }
    setApproveTitleFor(null)
    load()
  }

  async function handleRemove(member: Member) {
    if (!confirm(`Remove ${member.fullName || member.email} from the editorial board?`)) return
    setBusyId(member.id)
    setError(null)
    const res = await fetch('/api/admin/board/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: member.id }),
    })
    setBusyId(null)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Failed to remove.')
      return
    }
    load()
  }

  async function handleAdd() {
    if (!addUserId || !addTitle.trim()) return
    setError(null)
    const res = await fetch('/api/admin/board/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: addUserId, title: addTitle.trim() }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Failed to add.')
      return
    }
    setAddUserId('')
    setAddTitle('')
    load()
  }

  const pending = applications.filter((a) => a.status === 'pending')
  const decided = applications.filter((a) => a.status !== 'pending')
  const memberIds = new Set(members.map((m) => m.id))
  const availableUsers = users.filter((u) => !memberIds.has(u.id))

  if (!loaded) {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  return (
    <div>
      <AdminHeading title="Editorial Board" description="Review applications, and manage who currently holds a board seat." />
      <ErrorBanner message={error} />

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-royal-blue mb-3">Pending applications ({pending.length})</h2>
          <div className="border border-slate-200 divide-y divide-slate-200">
            {pending.map((app) => (
              <div key={app.id} className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-royal-blue">{app.fullName || 'Unnamed'}</p>
                    <p className="text-xs text-slate-500">{app.email}</p>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">{app.statement}</p>

                {approveTitleFor === app.id ? (
                  <div className="flex gap-2 items-center">
                    <input className={inputClass} value={approveTitle} onChange={(e) => setApproveTitle(e.target.value)} placeholder="Board title" />
                    <button disabled={busyId === app.id} onClick={() => handleDecide(app, 'approved', approveTitle)} className={primaryButtonClass}>
                      Confirm
                    </button>
                    <button onClick={() => setApproveTitleFor(null)} className={secondaryButtonClass}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === app.id}
                      onClick={() => {
                        setApproveTitleFor(app.id)
                        setApproveTitle('Editorial Board Member')
                      }}
                      className="flex items-center gap-1 text-sm text-emerald-700 hover:underline"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button disabled={busyId === app.id} onClick={() => handleDecide(app, 'declined')} className="flex items-center gap-1 text-sm text-red-700 hover:underline">
                      <X size={14} /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-sm font-semibold text-royal-blue mb-3">Current board members ({members.length})</h2>
        {members.length === 0 ? (
          <p className="text-slate-500 text-sm mb-4">No one is on the editorial board yet.</p>
        ) : (
          <div className="border border-slate-200 divide-y divide-slate-200 mb-4">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-royal-blue truncate">
                    {m.fullName || 'Unnamed'} <span className="ml-1 text-xs font-normal text-gold">{m.title}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate">{m.email}</p>
                </div>
                <button onClick={() => handleRemove(m)} disabled={busyId === m.id} className="text-slate-400 hover:text-red-600 shrink-0" aria-label="Remove from board">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border border-slate-200 p-4 max-w-xl">
          <p className="text-sm font-medium text-slate-700 mb-3">Add a board member directly</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="User">
              <select className={inputClass} value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
                <option value="">Select a user…</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title">
              <input className={inputClass} value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder="e.g. Associate Editor" />
            </Field>
          </div>
          <button onClick={handleAdd} disabled={!addUserId || !addTitle.trim()} className={primaryButtonClass}>
            Add to board
          </button>
        </div>
      </div>

      {decided.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-royal-blue mb-3">Past applications</h2>
          <div className="border border-slate-200 divide-y divide-slate-200">
            {decided.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 truncate">{app.fullName || app.email}</p>
                  <p className="text-xs text-slate-400">
                    {app.reviewedAt && new Date(app.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 border shrink-0 ${STATUS_STYLE[app.status]}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
