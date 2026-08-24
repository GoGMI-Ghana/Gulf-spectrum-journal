import { Link } from 'react-router-dom'
import { journal, issues, getArticlesForIssue } from '../data/content'
import ArticleCard from '../components/ArticleCard'
import IssueCover from '../components/IssueCover'
import JournalSubNav from '../components/JournalSubNav'
import WaveDivider from '../components/WaveDivider'
import { usePageMeta } from '../hooks/usePageMeta'

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
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          <div className="max-w-2xl">
            <p className="kicker text-gold mb-5">Gulf of Guinea Maritime Institute</p>
            <h1 className="font-display text-white text-4xl sm:text-5xl leading-[1.1] mb-4">
              The Gulf Spectrum
            </h1>
            <p className="text-soft-gold text-lg sm:text-xl mb-6 font-display">{journal.subtitle}</p>
            <p className="text-white/75 text-base leading-relaxed mb-9">
              Locally produced, editorially reviewed research on maritime governance,
              safety, and security in the Gulf of Guinea — written by the naval officers,
              researchers, and practitioners who work on these issues directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/issues/${latestIssue.slug}`}
                className="bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 transition-colors tracking-wide"
              >
                Read the Latest Issue
              </Link>
              <Link
                to="/about"
                className="border border-white/40 hover:border-gold text-white hover:text-gold font-medium px-6 py-3 transition-colors tracking-wide"
              >
                About the Journal
              </Link>
            </div>
          </div>

          <Link to={`/issues/${latestIssue.slug}`} className="hidden md:block w-44 lg:w-52 shrink-0 group">
            <IssueCover issue={latestIssue} className="w-full shadow-2xl shadow-black/40 group-hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </section>

      <JournalSubNav />

      {/* Latest issue */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-6 border-b-2 border-royal-blue pb-3">
              <h2 className="text-2xl font-bold text-royal-blue font-display">
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

          <aside className="space-y-8">
            <div className="border-l-4 border-gold bg-royal-blue text-white p-6">
              <h3 className="kicker text-gold mb-3">About the Journal</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                The Gulf Spectrum gives stakeholders across the Gulf of Guinea and beyond
                access to locally produced, insider perspectives on maritime governance,
                safety, and security in the region.
              </p>
              <Link to="/about" className="text-gold text-sm font-medium hover:underline">
                Learn more →
              </Link>
            </div>

            <div className="border-l-4 border-royal-blue p-6">
              <h3 className="kicker text-royal-blue mb-3">Submit Your Research</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                The Gulf Spectrum welcomes submissions from researchers, officers, and
                practitioners working on Gulf of Guinea maritime affairs.
              </p>
              <Link to="/submissions" className="text-ocean-blue text-sm font-medium hover:underline">
                View submission guidelines →
              </Link>
            </div>

            <div className="border-l-4 border-royal-blue p-6">
              <h3 className="kicker text-royal-blue mb-3">Scope</h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {journal.scopeAreas.slice(0, 4).map((area) => (
                  <li key={area} className="pb-2.5 border-b border-slate-200 last:border-0 last:pb-0">
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <WaveDivider className="text-royal-blue/20" />

      {/* Past issues teaser */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between mb-6 border-b-2 border-royal-blue pb-3">
            <h2 className="text-2xl font-bold text-royal-blue font-display">Browse All Issues</h2>
            <Link to="/issues" className="text-ocean-blue text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
            {issues.map((issue) => (
              <Link
                key={issue.slug}
                to={`/issues/${issue.slug}`}
                className="flex gap-5 bg-white p-6 hover:bg-soft-gold/40 transition-colors"
              >
                <IssueCover issue={issue} className="w-16 shrink-0 shadow" />
                <div>
                  <p className="kicker text-ocean-blue mb-1.5">
                    Vol. {issue.volume} · {issue.publishedDate}
                  </p>
                  <h3 className="font-semibold text-royal-blue mb-1.5 font-display">{issue.theme}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3">{issue.aboutThisVolume}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
