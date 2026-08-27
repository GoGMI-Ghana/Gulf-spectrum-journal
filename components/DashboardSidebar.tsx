'use client'

import Link from 'next/link'
import { Mail, Bell, Bookmark, UserCircle } from 'lucide-react'
import type { ComponentType } from 'react'
import { useBookmarks } from '@/context/BookmarksContext'
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
  const { user, bookmarks } = useBookmarks()
  const displayName = user?.fullName || user?.email || 'Guest Researcher'
  const subtitle = user ? (user.fullName ? user.email : 'Signed in') : 'Not signed in'

  return (
    <aside className="space-y-1">
      <div className="border border-slate-200 p-5 text-center mb-4">
        <Initials name={displayName} size="lg" className="mx-auto mb-3" />
        <p className="font-semibold text-royal-blue">{displayName}</p>
        <p className="text-xs text-slate-500 mb-4">{subtitle}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
          <span><strong className="text-royal-blue">0</strong> Followers</span>
          <span><strong className="text-royal-blue">0</strong> Following</span>
          <span><strong className="text-royal-blue">0</strong> Suggested</span>
        </div>
      </div>

      <SidebarLink href="/contact" icon={Mail} label="Messages" trailing={0} />
      <SidebarLink href="/contact" icon={Bell} label="Notifications" trailing={0} />
      <SidebarLink href="/bookmarks" icon={Bookmark} label="Bookmarks" trailing={bookmarks.length} />
      <SidebarLink href="/authors" icon={UserCircle} label="Author Profiles" />

      <Link
        href="/submissions"
        className="block text-center bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 mt-4 transition-colors tracking-wide"
      >
        Submit New Article
      </Link>
    </aside>
  )
}
