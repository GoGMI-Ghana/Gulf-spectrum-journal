import { Link, useParams, Navigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { getIssueBySlug, getArticlesForIssue } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import ArticleCard from '../components/ArticleCard'

export default function IssueDetail() {
  const { issueSlug } = useParams()
  const issue = getIssueBySlug(issueSlug)

  usePageMeta(
    issue ? `Issue ${issue.number}: ${issue.theme}` : 'Issue not found',
    issue?.aboutThisVolume
  )

  if (!issue) return <Navigate to="/issues" replace />

  const articles = getArticlesForIssue(issue.slug)

  return (
    <div>
      <section className="bg-royal-blue border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Volume {issue.volume}, Issue {issue.number} · {issue.publishedDate}
          </p>
          <h1 className="font-serif-display text-white text-3xl sm:text-4xl mb-4">{issue.theme}</h1>
          <p className="text-white/80 max-w-3xl leading-relaxed">{issue.aboutThisVolume}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-royal-blue mb-4">In This Issue</h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <aside>
          <div className="border border-slate-200 rounded-lg p-6 sticky top-32">
            <h3 className="flex items-center gap-2 font-semibold text-royal-blue text-sm uppercase tracking-wide mb-4">
              <Users size={16} /> Issue Editorial Board
            </h3>
            <ul className="space-y-3">
              {issue.editorialBoard.map((m) => (
                <li key={m.name}>
                  <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                  <p className="text-slate-500 text-xs">{m.role}</p>
                </li>
              ))}
            </ul>
            <Link to="/issues" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              ← All issues
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
