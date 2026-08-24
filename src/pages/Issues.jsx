import { Link } from 'react-router-dom'
import { issues, getArticlesForIssue } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'
import IssueCover from '../components/IssueCover'

export default function Issues() {
  usePageMeta('Issues', 'Browse all issues of The Gulf Spectrum, the GoGMI Journal of Maritime Research, by volume and theme.')

  const byYear = issues.reduce((acc, issue) => {
    acc[issue.year] = acc[issue.year] || []
    acc[issue.year].push(issue)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => b - a)

  return (
    <div>
      <PageBanner eyebrow="Archive" title="All Issues" description="Browse The Gulf Spectrum by volume. Each issue is a themed, editorially reviewed collection of research articles." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-lg font-bold text-royal-blue font-display border-b-2 border-royal-blue pb-2 mb-6">{year}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
              {byYear[year].map((issue) => {
                const articleCount = getArticlesForIssue(issue.slug).length
                return (
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
                      <p className="text-sm text-slate-500">{articleCount} articles</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
