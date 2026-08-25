import { Link } from 'react-router-dom'
import { Search, Bookmark, Quote, Upload, BarChart3 } from 'lucide-react'
import { useBookmarks } from '../context/BookmarksContext'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

export default function Tools() {
  const { bookmarks } = useBookmarks()
  usePageMeta('Tools', 'Search, citations, bookmarks, and other tools for working with Gulf Spectrum Journal.')

  const tools = [
    { to: '/search', icon: Search, title: 'Search', body: 'Find articles by title, abstract, keyword, or author.' },
    { to: '/citations', icon: Quote, title: 'Citations', body: 'Copy a ready-made citation for any published article.' },
    { to: '/bookmarks', icon: Bookmark, title: 'Bookmarks', body: `${bookmarks.length} saved article${bookmarks.length === 1 ? '' : 's'} in this browser.` },
    { to: '/submissions', icon: Upload, title: 'Upload / Submit', body: 'Start a submission for a future issue.' },
    { to: '/analytics', icon: BarChart3, title: 'Analytics', body: 'Readership and engagement across the journal.' },
  ]

  return (
    <div>
      <PageBanner eyebrow="Tools" title="Tools" description="Everything for working with Gulf Spectrum Journal in one place." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="bg-white p-6 hover:bg-soft-gold/40 transition-colors flex gap-4">
              <t.icon className="text-ocean-blue shrink-0" size={22} />
              <div>
                <h3 className="font-semibold text-royal-blue mb-1">{t.title}</h3>
                <p className="text-sm text-slate-500">{t.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
