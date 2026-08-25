import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Home, Quote, BarChart3, Upload, Grid3x3 } from 'lucide-react'
import { journal } from '../data/content'
import AccountMenu from './AccountMenu'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/issues', label: 'Articles and Issues' },
  { to: '/topics', label: 'Topics' },
  { to: '/about', label: 'About the Journal' },
  { to: '/authors', label: 'Authors' },
  { to: '/submissions', label: 'Submission Guidelines' },
  { to: '/contact', label: 'Contact' },
]

const iconNav = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/citations', label: 'Citations', icon: Quote },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/submissions', label: 'Upload', icon: Upload },
  { to: '/tools', label: 'Tools', icon: Grid3x3 },
]

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium tracking-wide transition-colors ${
          isActive ? 'text-gold' : 'text-white/85 hover:text-gold'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

function IconNavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
          isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
        }`
      }
    >
      <Icon size={18} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </NavLink>
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
          <Link to="/" className="flex items-center gap-4 min-w-0">
            <img
              src="/gogmi-logo.png"
              alt="Gulf of Guinea Maritime Institute"
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0"
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
              <IconNavItem key={item.to} {...item} />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4">
            <Link
              to="/membership"
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
            <NavItem key={l.to} {...l} />
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-ink border-t border-gold">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
            ))}
            {iconNav
              .filter((i) => i.to !== '/')
              .map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} onClick={() => setOpen(false)} />
              ))}
            <Link
              to="/membership"
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
