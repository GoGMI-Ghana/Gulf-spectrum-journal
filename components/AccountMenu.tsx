'use client'

import { useState, useRef, useEffect, type ComponentType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UserCircle,
  User,
  UserPlus,
  Mail,
  Bell,
  Settings,
  LogIn,
  LogOut,
  LayoutDashboard,
  Bookmark,
  Quote,
  BarChart3,
  Newspaper,
  Tags,
  Users,
  Upload,
  Grid3x3,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import { useAccount } from '@/context/AccountContext'
import { createClient } from '@/lib/supabase/client'
import Initials from './Initials'

function SectionLabel({ children }: { children: string }) {
  return <p className="kicker text-slate-400 px-4 pt-4 pb-1.5">{children}</p>
}

function MenuLink({
  href,
  icon: Icon,
  label,
  badge,
  onNavigate,
}: {
  href: string
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  badge?: number
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-soft-gold/50"
    >
      <Icon size={16} className="text-ocean-blue shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-gold text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center shrink-0">
          {badge}
        </span>
      )}
    </Link>
  )
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-soft-gold/50 text-left"
    >
      <Icon size={16} className="text-ocean-blue shrink-0" />
      <span className="flex-1">{label}</span>
    </button>
  )
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, isEditor, bookmarks, unreadNotifications, unreadMessages } = useAccount()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function close() {
    setOpen(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    close()
    router.push('/')
  }

  const displayName = user?.fullName || user?.email || 'Guest Researcher'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-white/85 hover:text-gold transition-colors text-sm"
      >
        <UserCircle size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 shadow-lg z-50 text-ink max-h-[80vh] overflow-y-auto">
          {/* Identity header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200">
            <Initials name={displayName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-royal-blue">{displayName}</p>
              <p className="text-xs text-slate-400">{user ? user.email : 'Not signed in'}</p>
            </div>
          </div>

          <SectionLabel>Account</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/profile" icon={User} label="My Profile" onNavigate={close} />
            <MenuLink href="/messages" icon={Mail} label="Messages" badge={unreadMessages} onNavigate={close} />
            <MenuLink
              href="/notifications"
              icon={Bell}
              label="Notifications"
              badge={unreadNotifications}
              onNavigate={close}
            />
            <MenuLink href="/account-settings" icon={Settings} label="Account Settings" onNavigate={close} />
            {user ? (
              <MenuButton icon={LogOut} label="Sign Out" onClick={handleSignOut} />
            ) : (
              <>
                <MenuLink href="/sign-in" icon={LogIn} label="Sign In" onNavigate={close} />
                <MenuLink href="/sign-up" icon={UserPlus} label="Sign Up" onNavigate={close} />
              </>
            )}
          </div>

          {isEditor && (
            <>
              <SectionLabel>Editorial</SectionLabel>
              <div className="pb-2">
                <MenuLink href="/admin" icon={ShieldCheck} label="Editorial Admin" onNavigate={close} />
              </div>
            </>
          )}

          <SectionLabel>My Research</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onNavigate={close} />
            <MenuLink href="/bookmarks" icon={Bookmark} label="Bookmarks" badge={bookmarks.length} onNavigate={close} />
            <MenuLink href="/citations" icon={Quote} label="Citations" onNavigate={close} />
            <MenuLink href="/analytics" icon={BarChart3} label="Analytics" onNavigate={close} />
          </div>

          <SectionLabel>Gulf Spectrum Journal</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/issues" icon={Newspaper} label="Articles and Issues" onNavigate={close} />
            <MenuLink href="/topics" icon={Tags} label="Topics" onNavigate={close} />
            <MenuLink href="/authors" icon={Users} label="Authors" onNavigate={close} />
            <MenuLink href="/submissions" icon={Upload} label="Submission Guidelines" onNavigate={close} />
          </div>

          <SectionLabel>More</SectionLabel>
          <div className="pb-3">
            <MenuLink href="/tools" icon={Grid3x3} label="Tools" onNavigate={close} />
            <MenuLink href="/contact" icon={MessageCircle} label="Contact" onNavigate={close} />
          </div>
        </div>
      )}
    </div>
  )
}
