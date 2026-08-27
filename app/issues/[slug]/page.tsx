import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getIssues, getIssueBySlug, getArticlesForIssue } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'
import IssueCover from '@/components/IssueCover'

export async function generateStaticParams() {
  const issues = await getIssues()
  return issues.map((issue) => ({ slug: issue.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const issue = await getIssueBySlug(slug)
  if (!issue) return { title: 'Issue not found' }
  return {
    title: `Issue ${issue.number}: ${issue.theme}`,
    description: issue.aboutThisVolume,
  }
}

export default async function IssueDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const issue = await getIssueBySlug(slug)
  if (!issue) notFound()

  const articles = await getArticlesForIssue(issue.slug)

  return (
    <div>
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-start gap-6 sm:gap-8">
          <IssueCover issue={issue} className="w-20 sm:w-28 shrink-0 shadow-xl shadow-black/30" />
          <div>
            <p className="kicker text-gold mb-2">
              Volume {issue.volume} · {issue.publishedDate}
            </p>
            <h1 className="font-display text-white text-3xl sm:text-4xl mb-4">{issue.theme}</h1>
            <p className="text-white/75 max-w-3xl leading-relaxed">{issue.aboutThisVolume}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
            In This Issue
          </h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <aside>
          <div className="border-l-4 border-gold p-6 sticky top-32">
            <h3 className="kicker text-royal-blue mb-4">Issue Editorial Board</h3>
            <ul className="space-y-3">
              {issue.editorialBoard.map((m) => (
                <li key={m.name} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                  <p className="text-slate-500 text-xs">{m.role}</p>
                </li>
              ))}
            </ul>
            <Link href="/issues" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              ← All issues
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
