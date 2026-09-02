'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Mail, Bell, Bookmark, UserCircle, LogOut, ShieldCheck } from 'lucide-react'
import type { ComponentType } from 'react'
import { useAccount } from '@/context/AccountContext'
import { createClient } from '@/lib/supabase/client'
import Initials from './Initials'

function SidebarLink({
  href,
  icon: Icon,
  label,
  trailing,
}: {
  href: string
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  trailing?: number
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-soft-gold/40">
      <Icon size={17} className="text-ocean-blue shrink-0" />
      <span className="flex-1">{label}</span>
      {trailing != null && <span className="text-xs text-slate-400">{trailing}</span>}
    </Link>
  )
}

export default function DashboardSidebar() {
  const { user, isEditor, bookmarks, unreadNotifications, unreadMessages } = useAccount()
  const router = useRouter()
  const pathname = usePathname()
  const displayName = user?.fullName || user?.email || 'Guest Researcher'
  const subtitle = user ? (user.fullName ? user.email : 'Signed in') : 'Not signed in'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="space-y-1">
      <div className="border border-slate-200 p-5 text-center mb-4">
        <Initials name={displayName} size="lg" className="mx-auto mb-3" />
        <p className="font-semibold text-royal-blue">{displayName}</p>
        <p className="text-xs text-slate-500 mb-4">{subtitle}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3 mb-4">
          <span><strong className="text-royal-blue">0</strong> Followers</span>
          <span><strong className="text-royal-blue">0</strong> Following</span>
          <span><strong className="text-royal-blue">0</strong> Suggested</span>
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-royal-blue transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        ) : (
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link href={`/sign-in?redirect=${encodeURIComponent(pathname)}`} className="text-ocean-blue hover:underline font-medium">
              Sign In
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/sign-up" className="text-ocean-blue hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <SidebarLink href="/messages" icon={Mail} label="Messages" trailing={unreadMessages} />
      <SidebarLink href="/notifications" icon={Bell} label="Notifications" trailing={unreadNotifications} />
      <SidebarLink href="/bookmarks" icon={Bookmark} label="Bookmarks" trailing={bookmarks.length} />
      <SidebarLink href="/authors" icon={UserCircle} label="Author Profiles" />
      {isEditor && <SidebarLink href="/admin" icon={ShieldCheck} label="Editorial Admin" />}

      <Link
        href="/submissions"
        className="block text-center bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 mt-4 transition-colors tracking-wide"
      >
        Submit New Article
      </Link>
    </aside>
  )
}
