'use client'

import { useState, type ComponentType } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Quote, BarChart3, Upload, Grid3x3 } from 'lucide-react'
import { journal } from '@/lib/content'
import AccountMenu from './AccountMenu'

const navLinks = [
  { href: '/', label: 'Home', end: true },
  { href: '/issues', label: 'Articles and Issues' },
  { href: '/topics', label: 'Topics' },
  { href: '/about', label: 'About the Journal' },
  { href: '/authors', label: 'Authors' },
  { href: '/submissions', label: 'Submission Guidelines' },
  { href: '/contact', label: 'Contact' },
]

const iconNav = [
  { href: '/', label: 'Home', icon: Home, end: true },
  { href: '/citations', label: 'Citations', icon: Quote },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/submissions', label: 'Upload', icon: Upload },
  { href: '/tools', label: 'Tools', icon: Grid3x3 },
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
      className={`text-sm font-medium tracking-wide transition-colors ${
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
      className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
        isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
      }`}
    >
      <Icon size={18} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-ink text-white/60 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <span className="hidden sm:inline kicker font-normal tracking-[0.1em] text-white/50">
            A publication of the Gulf of Guinea Maritime Institute
          </span>
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
                {journal.subtitle}
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {iconNav.map((item) => (
              <IconNavItem key={item.href} {...item} />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4">
            <Link
              href="/membership"
              className="bg-gold hover:bg-soft-gold text-ink font-semibold text-sm px-5 py-2 transition-colors tracking-wide whitespace-nowrap"
            >
              Try Premium
            </Link>
            <AccountMenu />
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:block bg-ink border-t border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 h-11">
          {navLinks.map((l) => (
            <NavItem key={l.href} {...l} />
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-ink border-t border-gold">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <NavItem key={l.href} {...l} onClick={() => setOpen(false)} />
            ))}
            {iconNav
              .filter((i) => i.href !== '/')
              .map((item) => (
                <NavItem key={item.href} href={item.href} label={item.label} onClick={() => setOpen(false)} />
              ))}
            <Link
              href="/membership"
              onClick={() => setOpen(false)}
              className="border border-gold text-gold text-sm px-4 py-2 text-center mt-1"
            >
              Try Premium
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
