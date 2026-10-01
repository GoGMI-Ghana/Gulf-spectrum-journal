'use client'

import { useState, useRef, useEffect, type ComponentType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CircleUserRound,
  User,
  UserPlus,
  Mail,
  Bell,
  Settings,
  LogIn,
  LogOut,
  LayoutDashboard,
  Bookmark,
  TextQuote,
  ChartNoAxesCombined,
  Newspaper,
  Tags,
  Users,
  FileUp,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { createClient } from '@/lib/supabase/client'
import Initials from './Initials'
import BoardBadge from './BoardBadge'

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
  const { user, isEditor, boardTitle, bookmarks, unreadNotifications, unreadMessages } = useAccount()
  const { t } = useI18n()

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

  const displayName = user?.fullName || user?.email || t.accountMenu.guest

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.accountMenu.ariaLabel}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-white/85 hover:text-gold transition-colors text-sm"
      >
        <CircleUserRound size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 shadow-lg z-50 text-ink max-h-[80vh] overflow-y-auto">
          {/* Identity header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200">
            <Initials name={displayName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-royal-blue flex items-center gap-1.5">
                {displayName}
                {boardTitle && <BoardBadge title={boardTitle} />}
              </p>
              <p className="text-xs text-slate-400">{user ? user.email : t.accountMenu.notSignedIn}</p>
            </div>
          </div>

          <SectionLabel>{t.accountMenu.sectionAccount}</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/profile" icon={User} label={t.nav.myProfile} onNavigate={close} />
            <MenuLink href="/messages" icon={Mail} label={t.nav.messages} badge={unreadMessages} onNavigate={close} />
            <MenuLink
              href="/notifications"
              icon={Bell}
              label={t.nav.notifications}
              badge={unreadNotifications}
              onNavigate={close}
            />
            <MenuLink href="/account-settings" icon={Settings} label={t.nav.accountSettings} onNavigate={close} />
            {user ? (
              <MenuButton icon={LogOut} label={t.common.signOut} onClick={handleSignOut} />
            ) : (
              <>
                <MenuLink href="/sign-in" icon={LogIn} label={t.common.signInButton} onNavigate={close} />
                <MenuLink href="/sign-up" icon={UserPlus} label={t.common.signUpButton} onNavigate={close} />
              </>
            )}
          </div>

          {isEditor && (
            <>
              <SectionLabel>{t.accountMenu.sectionEditorial}</SectionLabel>
              <div className="pb-2">
                <MenuLink href="/admin" icon={ShieldCheck} label={t.nav.editorialAdmin} onNavigate={close} />
              </div>
            </>
          )}

          <SectionLabel>{t.accountMenu.sectionMyResearch}</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/dashboard" icon={LayoutDashboard} label={t.nav.dashboard} onNavigate={close} />
            <MenuLink href="/bookmarks" icon={Bookmark} label={t.nav.bookmarks} badge={bookmarks.length} onNavigate={close} />
            <MenuLink href="/citations" icon={TextQuote} label={t.nav.citations} onNavigate={close} />
            <MenuLink href="/analytics" icon={ChartNoAxesCombined} label={t.nav.analytics} onNavigate={close} />
          </div>

          <SectionLabel>Gulf Spectrum Journal</SectionLabel>
          <div className="pb-2">
            <MenuLink href="/issues" icon={Newspaper} label={t.nav.articlesAndIssues} onNavigate={close} />
            <MenuLink href="/topics" icon={Tags} label={t.nav.topics} onNavigate={close} />
            <MenuLink href="/authors" icon={Users} label={t.nav.authors} onNavigate={close} />
            <MenuLink href="/editorial-board" icon={Award} label={t.nav.editorialBoard} onNavigate={close} />
            <MenuLink href="/submissions" icon={FileUp} label={t.nav.submissions} onNavigate={close} />
          </div>

          <SectionLabel>{t.accountMenu.sectionMore}</SectionLabel>
          <div className="pb-3">
            <MenuLink href="/tools" icon={LayoutGrid} label={t.nav.tools} onNavigate={close} />
            <MenuLink href="/contact" icon={MessageCircle} label={t.nav.contact} onNavigate={close} />
          </div>
        </div>
      )}
    </div>
  )
}
