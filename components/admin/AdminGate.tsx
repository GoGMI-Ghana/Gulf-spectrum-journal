'use client'

// Gates everything under /admin: signed-out visitors get a sign-in
// prompt, signed-in readers/authors get a plain "not authorized"
// message, and editors/admins get the admin nav + the page underneath.
// This is a UX convenience only — the real boundary is Postgres RLS
// (every table's "editors manage X" policy), so a client-side bypass of
// this component couldn't actually read or write anything it shouldn't.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType, ReactNode } from 'react'
import { LayoutDashboard, Newspaper, BookOpen, Tags, Users, UserCog, HeartHandshake } from 'lucide-react'
import { useAccount } from '@/context/AccountContext'

const NAV: { href: string; label: string; icon: ComponentType<{ size?: number; className?: string }>; end?: boolean }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { href: '/admin/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/issues', label: 'Issues', icon: BookOpen },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/topics', label: 'Topics', icon: Tags },
  { href: '/admin/donations', label: 'Donations', icon: HeartHandshake },
]

function NavLink({
  href,
  label,
  icon: Icon,
  end,
}: {
  href: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  end?: boolean
}) {
  const pathname = usePathname()
  const active = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        active ? 'bg-royal-blue text-white' : 'text-slate-700 hover:bg-soft-gold/40'
      }`}
    >
      <Icon size={16} className={active ? 'text-gold' : 'text-ocean-blue'} />
      {label}
    </Link>
  )
}

export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, authLoading, role } = useAccount()
  // role stays null both while it's still loading and (in practice never,
  // since every profile row defaults to 'reader') if it's genuinely
  // absent — treating "signed in, role not resolved yet" as loading is
  // the only case that actually happens here.
  const roleLoading = Boolean(user) && role === null
  const isEditor = role === 'editor' || role === 'admin'

  if (authLoading || roleLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-slate-500 text-sm">Checking access…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-2xl text-royal-blue mb-3">Editorial Admin</h1>
        <p className="text-slate-600 mb-6">Sign in with an editor or admin account to continue.</p>
        <Link
          href="/sign-in?redirect=/admin"
          className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-6 py-2.5 transition-colors inline-block"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (!isEditor) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-2xl text-royal-blue mb-3">Editorial Admin</h1>
        <p className="text-slate-600">
          Your account (&ldquo;{role ?? 'reader'}&rdquo;) doesn&apos;t have editorial access. Ask an
          existing admin to grant it from Users &amp; Roles.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1 lg:sticky lg:top-24 self-start">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        {role === 'admin' && <NavLink href="/admin/users" label="Users & Roles" icon={UserCog} />}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
