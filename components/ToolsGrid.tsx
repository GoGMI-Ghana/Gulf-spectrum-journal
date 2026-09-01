'use client'

import Link from 'next/link'
import { Search, Bookmark, Quote, Upload, BarChart3 } from 'lucide-react'
import { useAccount } from '@/context/AccountContext'

export default function ToolsGrid() {
  const { bookmarks } = useAccount()

  const tools = [
    { href: '/search', icon: Search, title: 'Search', body: 'Find articles by title, abstract, keyword, or author.' },
    { href: '/citations', icon: Quote, title: 'Citations', body: 'Copy a ready-made citation for any published article.' },
    { href: '/bookmarks', icon: Bookmark, title: 'Bookmarks', body: `${bookmarks.length} saved article${bookmarks.length === 1 ? '' : 's'} in this browser.` },
    { href: '/submissions', icon: Upload, title: 'Upload / Submit', body: 'Start a submission for a future issue.' },
    { href: '/analytics', icon: BarChart3, title: 'Analytics', body: 'Readership and engagement across the journal.' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
      {tools.map((t) => (
        <Link key={t.href} href={t.href} className="bg-white p-6 hover:bg-soft-gold/40 transition-colors flex gap-4">
          <t.icon className="text-ocean-blue shrink-0" size={22} />
          <div>
            <h3 className="font-semibold text-royal-blue mb-1">{t.title}</h3>
            <p className="text-sm text-slate-500">{t.body}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
