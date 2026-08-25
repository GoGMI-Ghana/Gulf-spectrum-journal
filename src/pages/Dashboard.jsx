import { Link } from 'react-router-dom'
import { Mail, Bell, Bookmark, UserCircle } from 'lucide-react'
import { articles, getIssueForArticle } from '../data/content'
import { useBookmarks } from '../context/BookmarksContext'
import { usePageMeta } from '../hooks/usePageMeta'
import Initials from '../components/Initials'
import ArticleCard from '../components/ArticleCard'

function SidebarLink({ to, icon: Icon, label, trailing }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-soft-gold/40">
      <Icon size={17} className="text-ocean-blue shrink-0" />
      <span className="flex-1">{label}</span>
      {trailing != null && <span className="text-xs text-slate-400">{trailing}</span>}
    </Link>
  )
}

export default function Dashboard() {
  const { bookmarks } = useBookmarks()
  usePageMeta('Dashboard', 'Your Gulf Spectrum Journal dashboard.')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      <aside className="space-y-1">
        <div className="border border-slate-200 p-5 text-center mb-4">
          <Initials name="Guest Researcher" size="lg" className="mx-auto mb-3" />
          <p className="font-semibold text-royal-blue">Guest Researcher</p>
          <p className="text-xs text-slate-500 mb-4">Not signed in</p>
          <div className="flex justify-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
            <span><strong className="text-royal-blue">0</strong> Followers</span>
            <span><strong className="text-royal-blue">0</strong> Following</span>
            <span><strong className="text-royal-blue">0</strong> Suggested</span>
          </div>
        </div>

        <SidebarLink to="/contact" icon={Mail} label="Messages" trailing={0} />
        <SidebarLink to="/contact" icon={Bell} label="Notifications" trailing={0} />
        <SidebarLink to="/bookmarks" icon={Bookmark} label="Bookmarks" trailing={bookmarks.length} />
        <SidebarLink to="/authors" icon={UserCircle} label="Author Profiles" />

        <Link
          to="/submissions"
          className="block text-center bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 mt-4 transition-colors tracking-wide"
        >
          Submit New Article
        </Link>
      </aside>

      <div>
        <Link
          to="/submissions"
          className="block border border-slate-300 hover:border-royal-blue px-4 py-3 text-sm text-slate-500 mb-8 transition-colors"
        >
          Share your research with other Gulf of Guinea maritime professionals →
        </Link>

        <h2 className="text-lg font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
          Recent Articles
        </h2>
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} issue={getIssueForArticle(article)} />
          ))}
        </div>
      </div>
    </div>
  )
}
