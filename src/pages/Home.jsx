import { Link } from 'react-router-dom'
import { Compass, ShieldCheck, Users, BookOpen, ArrowRight, Waves } from 'lucide-react'
import { journal, issues, getArticlesForIssue } from '../data/content'
import ArticleCard from '../components/ArticleCard'
import { usePageMeta } from '../hooks/usePageMeta'

const stats = [
  { icon: BookOpen, label: 'Issues published', value: issues.length },
  { icon: ShieldCheck, label: 'Editorially reviewed', value: '100%' },
  { icon: Users, label: 'Contributing authors', value: '10+' },
]

export default function Home() {
  usePageMeta(
    undefined,
    'The Gulf Spectrum is the GoGMI Journal of Maritime Research, publishing locally produced, editorially reviewed research on maritime security and governance in the Gulf of Guinea.'
  )

  const latestIssue = issues[0]
  const latestArticles = getArticlesForIssue(latestIssue.slug)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-royal-blue overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px, 64px 64px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-soft-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <Compass size={16} /> Gulf of Guinea Maritime Institute
            </p>
            <h1 className="font-serif-display text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6">
              The Gulf Spectrum
            </h1>
            <p className="text-soft-gold text-lg sm:text-xl mb-6">{journal.subtitle}</p>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Locally produced, editorially reviewed research on maritime governance,
              safety, and security in the Gulf of Guinea — written by the naval officers,
              researchers, and practitioners who work on these issues directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/issues/${latestIssue.slug}`}
                className="inline-flex items-center gap-2 bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 rounded transition-colors"
              >
                Read the Latest Issue <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-gold text-white hover:text-gold font-medium px-6 py-3 rounded transition-colors"
              >
                About the Journal
              </Link>
            </div>
          </div>
        </div>
        <Waves className="absolute -bottom-6 right-6 text-white/5 hidden lg:block" size={200} strokeWidth={0.5} />
      </section>

      {/* Stats bar */}
      <section className="bg-soft-gold border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-royal-blue flex items-center justify-center shrink-0">
                <s.icon className="text-gold" size={20} />
              </div>
              <div>
                <p className="text-royal-blue font-bold text-xl leading-none">{s.value}</p>
                <p className="text-slate-600 text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest issue */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-royal-blue">
                Issue {latestIssue.number}: {latestIssue.theme}
              </h2>
              <Link to={`/issues/${latestIssue.slug}`} className="text-ocean-blue text-sm font-medium hover:underline whitespace-nowrap ml-4">
                View issue →
              </Link>
            </div>
            <div>
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-royal-blue text-white rounded-lg p-6">
              <h3 className="font-semibold text-gold text-sm uppercase tracking-wide mb-3">About the Journal</h3>
              <p className="text-white/85 text-sm leading-relaxed mb-4">
                The Gulf Spectrum gives stakeholders across the Gulf of Guinea and beyond
                access to locally produced, insider perspectives on maritime governance,
                safety, and security in the region.
              </p>
              <Link to="/about" className="text-gold text-sm font-medium hover:underline inline-flex items-center gap-1">
                Learn more <ArrowRight size={14} />
              </Link>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-3">Submit Your Research</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                The Gulf Spectrum welcomes submissions from researchers, officers, and
                practitioners working on Gulf of Guinea maritime affairs.
              </p>
              <Link to="/submissions" className="text-ocean-blue text-sm font-medium hover:underline inline-flex items-center gap-1">
                View submission guidelines <ArrowRight size={14} />
              </Link>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-3">Scope</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {journal.scopeAreas.slice(0, 4).map((area) => (
                  <li key={area} className="flex gap-2">
                    <span className="text-gold mt-1">▸</span> {area}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Past issues teaser */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-royal-blue">Browse All Issues</h2>
            <Link to="/issues" className="text-ocean-blue text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {issues.map((issue) => (
              <Link
                key={issue.slug}
                to={`/issues/${issue.slug}`}
                className="block bg-white border border-slate-200 rounded-lg p-6 hover:border-gold hover:shadow-md transition-all"
              >
                <p className="text-xs font-semibold text-ocean-blue uppercase tracking-wide mb-2">
                  Issue {issue.number} · {issue.publishedDate}
                </p>
                <h3 className="font-semibold text-royal-blue mb-2">{issue.theme}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{issue.aboutThisVolume}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
