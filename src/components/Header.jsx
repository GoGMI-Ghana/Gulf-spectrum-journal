import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ExternalLink, Search } from 'lucide-react'
import CompassMark from './CompassMark'
import { journal } from '../data/content'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/issues', label: 'Issues' },
  { to: '/about', label: 'About the Journal' },
  { to: '/authors', label: 'Authors' },
  { to: '/submissions', label: 'Submission Guidelines' },
  { to: '/contact', label: 'Contact' },
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

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-ink text-white/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <span className="hidden sm:inline">A publication of the Gulf of Guinea Maritime Institute</span>
          <a
            href="https://www.gogmi.org.gh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gold transition-colors"
          >
            Visit gogmi.org.gh <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-royal-blue border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <CompassMark className="w-11 h-11 shrink-0" />
            <span className="min-w-0">
              <span className="block font-serif-display text-white text-xl sm:text-2xl leading-tight tracking-wide truncate">
                THE GULF SPECTRUM
              </span>
              <span className="block text-soft-gold text-[11px] sm:text-xs uppercase tracking-[0.15em]">
                {journal.subtitle}
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/issues"
              className="hidden lg:inline-flex items-center gap-1.5 text-white/80 hover:text-gold text-sm"
            >
              <Search size={16} /> Browse issues
            </Link>
            <Link
              to="/submissions"
              className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2 rounded transition-colors"
            >
              Submit an Article
            </Link>
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
      <nav className="hidden md:block bg-ocean-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-7 h-11">
          {navLinks.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden bg-ocean-blue border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-3">
            {navLinks.map((l) => (
              <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
            ))}
            <Link
              to="/submissions"
              onClick={() => setOpen(false)}
              className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded text-center mt-1"
            >
              Submit an Article
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
