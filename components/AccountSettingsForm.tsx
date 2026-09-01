'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/context/AccountContext'

export default function AccountSettingsForm() {
  const { user, authLoading } = useAccount()
  const router = useRouter()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false)

  const [confirmEmail, setConfirmEmail] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSaved(false)

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)

    if (error) {
      setPasswordError(error.message)
      return
    }
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaved(true)
  }

  async function handleSignOutEverywhere() {
    setSigningOutEverywhere(true)
    const supabase = createClient()
    // scope: 'global' revokes every refresh token for this account, not
    // just this browser's session.
    await supabase.auth.signOut({ scope: 'global' })
    router.push('/')
  }

  async function handleDeleteAccount(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setDeleteError(null)

    if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setDeleteError('Type your account email exactly to confirm.')
      return
    }

    setDeleting(true)
    const res = await fetch('/api/account/delete', { method: 'POST' })
    if (!res.ok) {
      setDeleting(false)
      const body = await res.json().catch(() => null)
      setDeleteError(body?.error || 'Failed to delete account.')
      return
    }

    // The account (and its session) is gone server-side; clear the local
    // session too so the UI reflects that immediately.
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (authLoading) {
    return <p className="text-slate-500 text-sm">Loading…</p>
  }

  if (!user) {
    return (
      <p className="text-slate-600">
        <Link href="/sign-in?redirect=/account-settings" className="text-ocean-blue hover:underline">
          Sign in
        </Link>{' '}
        to manage your account settings.
      </p>
    )
  }

  return (
    <div className="max-w-lg space-y-12">
      {/* Change password */}
      <div>
        <h2 className="text-lg font-bold text-royal-blue font-display mb-1">Change Password</h2>
        <p className="text-sm text-slate-500 mb-4">
          If you signed up with Google, this sets a password you can also use to sign in directly.
        </p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{passwordError}</p>
          )}
          {passwordSaved && !passwordError && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2">
              Password updated.
            </p>
          )}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
            />
          </div>
          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
          >
            {passwordSaving ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Sessions */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="text-lg font-bold text-royal-blue font-display mb-1">Sessions</h2>
        <p className="text-sm text-slate-500 mb-4">
          Sign out everywhere if you think another device or browser still has you signed in.
        </p>
        <button
          onClick={handleSignOutEverywhere}
          disabled={signingOutEverywhere}
          className="border border-slate-300 hover:border-royal-blue text-slate-700 font-medium px-6 py-2.5 transition-colors disabled:opacity-60"
        >
          {signingOutEverywhere ? 'Signing out…' : 'Sign Out Everywhere'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="pt-8 border-t border-red-200">
        <h2 className="text-lg font-bold text-red-700 font-display mb-1">Delete Account</h2>
        <p className="text-sm text-slate-500 mb-4">
          Permanently deletes your account, profile, bookmarks, messages, and notifications. This
          cannot be undone.
        </p>
        <form onSubmit={handleDeleteAccount} className="space-y-3">
          {deleteError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{deleteError}</p>
          )}
          <div>
            <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-700 mb-1">
              Type <span className="font-mono">{user.email}</span> to confirm
            </label>
            <input
              id="confirmEmail"
              type="text"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={deleting || confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting…' : 'Permanently Delete My Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
