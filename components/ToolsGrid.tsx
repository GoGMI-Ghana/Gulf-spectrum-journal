'use client'

import Link from 'next/link'
import { Search, Bookmark, TextQuote, FileUp, ChartNoAxesCombined } from 'lucide-react'
import { useAccount } from '@/context/AccountContext'
import { useI18n } from '@/context/I18nContext'
import { plural } from '@/lib/i18n/format'

export default function ToolsGrid() {
  const { bookmarks } = useAccount()
  const { locale, t } = useI18n()

  const tools = [
    { href: '/search', icon: Search, title: t.tools.searchTitle, body: t.tools.searchBody },
    { href: '/citations', icon: TextQuote, title: t.tools.citationsTitle, body: t.tools.citationsBody },
    { href: '/bookmarks', icon: Bookmark, title: t.tools.bookmarksTitle, body: plural(locale, t.tools.bookmarksBody, bookmarks.length) },
    { href: '/submissions', icon: FileUp, title: t.tools.uploadTitle, body: t.tools.uploadBody },
    { href: '/analytics', icon: ChartNoAxesCombined, title: t.tools.analyticsTitle, body: t.tools.analyticsBody },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
      {tools.map((tool) => (
        <Link key={tool.href} href={tool.href} className="bg-white p-6 hover:bg-soft-gold/40 transition-colors flex gap-4">
          <tool.icon className="text-ocean-blue shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="font-semibold text-royal-blue mb-1">{tool.title}</h3>
            <p className="text-sm text-slate-500">{tool.body}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
