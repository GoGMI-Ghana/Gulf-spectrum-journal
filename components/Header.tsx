'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import AccountMenu from './AccountMenu'
import LanguageSwitcher from './LanguageSwitcher'

type NavKey = keyof Dictionary['nav']

// The one menu. Tools, Analytics, Bookmarks and the rest live in the
// account menu and the footer rather than in a second row of icons here.
const navLinks: { href: string; label: NavKey; end?: boolean }[] = [
  { href: '/', label: 'home', end: true },
  { href: '/issues', label: 'articlesAndIssues' },
  { href: '/topics', label: 'topics' },
  { href: '/about', label: 'about' },
  { href: '/authors', label: 'authors' },
  { href: '/submissions', label: 'submissions' },
  { href: '/contact', label: 'contact' },
]

function useIsActive(href: string, end?: boolean) {
  const pathname = usePathname()
  return end ? pathname === href : pathname.startsWith(href)
}

function NavItem({
  href,
  label,
  end,
  onClick,
  mobile,
}: {
  href: string
  label: string
  end?: boolean
  onClick?: () => void
  mobile?: boolean
}) {
  const isActive = useIsActive(href, end)
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`text-sm font-medium whitespace-nowrap transition-colors ${
        mobile ? 'block py-3 border-b border-white/10' : 'inline-flex items-center h-11 border-b-2'
      } ${isActive ? 'text-white border-gold' : 'text-white/80 border-transparent hover:text-white'}`}
    >
      {label}
    </Link>
  )
}

// Not sticky: on a phone a header that stays put takes a large share of
// the screen, and it can hide whatever a keyboard user has moved to.
export default function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header>
      {/* Masthead */}
      <div className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Image
              src="/gogmi-logo.png"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
              priority
            />
            <span className="min-w-0">
              <span className="block font-display text-white text-xl sm:text-[1.65rem] leading-tight">
                Gulf Spectrum Journal
              </span>
              <span className="block text-soft-gold text-xs sm:text-sm leading-snug mt-0.5">{t.journal.subtitle}</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <div className="hidden md:block">
              <LanguageSwitcher className="text-white/80" />
            </div>
            <Link
              href="/search"
              aria-label={t.subNav.search}
              className="inline-flex items-center justify-center h-11 w-11 text-white/85 hover:text-white"
            >
              <Search size={20} aria-hidden="true" />
            </Link>
            <div className="hidden md:block">
              <AccountMenu />
            </div>
            <button
              className="md:hidden inline-flex items-center justify-center h-11 w-11 text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label={t.header.toggleMenu}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav aria-label={t.header.mainMenu} className="hidden md:block bg-ink">
        {/* French/Spanish/Portuguese labels run longer than English: tighter
            gaps below lg, and scroll rather than wrap if they still overflow. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5 lg:gap-8 overflow-x-auto">
          {navLinks.map((l) => (
            <NavItem key={l.href} {...l} label={t.nav[l.label]} />
          ))}
        </div>
      </nav>

      {open && (
        <nav id="mobile-nav" aria-label={t.header.mainMenu} className="md:hidden bg-ink">
          <div className="px-4 pt-1 pb-5">
            {navLinks.map((l) => (
              <NavItem key={l.href} {...l} label={t.nav[l.label]} onClick={() => setOpen(false)} mobile />
            ))}
            <div className="flex items-center justify-between gap-4 pt-4">
              <LanguageSwitcher className="text-white/80" />
              <AccountMenu />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
