'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'

const tabs: { href: string; label: keyof Dictionary['nav']; end?: boolean }[] = [
  { href: '/', label: 'latestIssue', end: true },
  { href: '/issues', label: 'articlesAndIssues' },
  { href: '/topics', label: 'topics' },
  { href: '/about', label: 'about' },
  { href: '/authors', label: 'authors' },
]

export default function JournalSubNav() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 py-3">
        <nav className="flex flex-wrap items-center gap-6 order-2 lg:order-1">
          {tabs.map((tab) => {
            const isActive = tab.end ? pathname === tab.href : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-medium py-1 border-b-2 transition-colors ${
                  isActive ? 'text-royal-blue border-gold' : 'text-slate-500 border-transparent hover:text-royal-blue'
                }`}
              >
                {t.nav[tab.label]}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        <form onSubmit={handleSubmit} className="order-1 lg:order-2 flex items-center border border-slate-300 focus-within:border-royal-blue max-w-sm w-full">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.subNav.searchPlaceholder}
            aria-label={t.subNav.searchPlaceholder}
            className="w-full px-3 py-2 text-sm focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t.subNav.search}
            className="bg-royal-blue text-white px-3 py-2 shrink-0 hover:bg-ocean-blue transition-colors"
          >
            <SearchIcon size={15} />
          </button>
        </form>

        <Link
          href="/submissions"
          className="order-3 text-sm font-medium text-ocean-blue hover:underline whitespace-nowrap"
        >
          {t.subNav.submitArticle}
        </Link>
      </div>
    </div>
  )
}
