'use client'

import { useState, type ComponentType } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, House, TextQuote, ChartNoAxesCombined, FileUp, LayoutGrid } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import AccountMenu from './AccountMenu'
import LanguageSwitcher from './LanguageSwitcher'

type NavKey = keyof Dictionary['nav']

const navLinks: { href: string; label: NavKey; end?: boolean }[] = [
  { href: '/', label: 'home', end: true },
  { href: '/issues', label: 'articlesAndIssues' },
  { href: '/topics', label: 'topics' },
  { href: '/about', label: 'about' },
  { href: '/authors', label: 'authors' },
  { href: '/submissions', label: 'submissions' },
  { href: '/contact', label: 'contact' },
]

const iconNav: { href: string; label: NavKey; icon: ComponentType<{ size?: number }>; end?: boolean }[] = [
  { href: '/', label: 'home', icon: House, end: true },
  { href: '/citations', label: 'citations', icon: TextQuote },
  { href: '/analytics', label: 'analytics', icon: ChartNoAxesCombined },
  { href: '/submissions', label: 'upload', icon: FileUp },
  { href: '/tools', label: 'tools', icon: LayoutGrid },
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
}: {
  href: string
  label: string
  end?: boolean
  onClick?: () => void
}) {
  const isActive = useIsActive(href, end)
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
        isActive ? 'text-gold' : 'text-white/85 hover:text-gold'
      }`}
    >
      {label}
    </Link>
  )
}

function IconNavItem({
  href,
  label,
  icon: Icon,
  end,
}: {
  href: string
  label: string
  icon: ComponentType<{ size?: number }>
  end?: boolean
}) {
  const isActive = useIsActive(href, end)
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 px-2.5 py-1 transition-colors ${
        isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
      }`}
    >
      <Icon size={16} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-ink text-white/60 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          <span className="hidden sm:inline kicker font-normal tracking-[0.1em] text-white/50">
            {t.header.publicationOf}
          </span>
          <div className="flex items-center gap-4 ml-auto">
            <LanguageSwitcher className="text-white/60" />
            <a
              href="https://www.gogmi.org.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors kicker font-normal tracking-[0.1em]"
            >
              gogmi.org.gh
            </a>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <Image
              src="/gogmi-logo.png"
              alt="Gulf of Guinea Maritime Institute"
              width={48}
              height={48}
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0"
              priority
            />
            <span className="min-w-0 border-l border-white/20 pl-4">
              <span className="block font-display text-white text-xl sm:text-2xl leading-tight tracking-wide truncate">
                Gulf Spectrum Journal
              </span>
              <span className="block text-soft-gold text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
                {t.journal.subtitle}
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {iconNav.map((item) => (
              <IconNavItem key={item.href} {...item} label={t.nav[item.label]} />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4">
            <AccountMenu />
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.header.toggleMenu}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:block bg-ink border-t border-gold">
        {/* French/Spanish/Portuguese labels run longer than English: tighter
            gaps below lg, and scroll rather than wrap if they still overflow. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5 lg:gap-8 h-11 overflow-x-auto">
          {navLinks.map((l) => (
            <NavItem key={l.href} {...l} label={t.nav[l.label]} />
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-ink border-t border-gold">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <NavItem key={l.href} {...l} label={t.nav[l.label]} onClick={() => setOpen(false)} />
            ))}
            {iconNav
              .filter((i) => i.href !== '/')
              .map((item) => (
                <NavItem key={item.href} href={item.href} label={t.nav[item.label]} onClick={() => setOpen(false)} />
              ))}
          </div>
        </nav>
      )}
    </header>
  )
}
