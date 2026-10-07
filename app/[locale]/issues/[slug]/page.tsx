import Link from 'next/link'
import { Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getIssues, getIssueBySlug, getArticlesForIssue } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { socialMetadata } from '@/lib/seo'
import ArticleCard from '@/components/ArticleCard'
import IssueCover from '@/components/IssueCover'

export async function generateStaticParams() {
  const issues = await getIssues()
  return issues.map((issue) => ({ slug: issue.slug }))
}

export async function generateMetadata({ params }: LocaleSlugParams): Promise<Metadata> {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const issue = await getIssueBySlug(slug)
  if (!issue) return { title: t.issue.notFound }
  const title = fmt(t.issue.metaTitle, { number: issue.number, theme: issue.theme })
  return {
    title,
    description: issue.aboutThisVolume,
    ...socialMetadata({
      title,
      description: issue.aboutThisVolume,
      path: `/issues/${issue.slug}`,
      // The issue's own cover when it has one, else the generic card.
      image: issue.coverImage || undefined,
    }),
  }
}

export default async function IssueDetail({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
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
              {fmt(t.issue.volume, { volume: issue.volume, date: issue.publishedDate })}
            </p>
            <h1 className="font-display text-white text-3xl sm:text-4xl mb-4">{issue.theme}</h1>
            <p className="text-white/75 max-w-3xl leading-relaxed">{issue.aboutThisVolume}</p>
            {articles.length > 0 && (
              // Generated on request (app/api/issues/[slug]/pdf). A plain <a>:
              // /api paths aren't pages for next/link to route to.
              <a
                href={`/api/issues/${issue.slug}/pdf`}
                download
                className="inline-flex items-center gap-2 mt-5 border border-gold text-gold hover:bg-gold hover:text-ink text-sm font-medium px-4 py-2 transition-colors"
              >
                <Download size={16} />
                {t.issue.downloadPdf}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
            {t.issue.inThisIssue}
          </h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <aside>
          <div className="border-l-4 border-gold p-6 sticky top-32">
            <h3 className="kicker text-royal-blue mb-4">{t.issue.issueBoard}</h3>
            <ul className="space-y-3">
              {issue.editorialBoard.map((m) => (
                <li key={m.name} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                  <p className="text-slate-500 text-xs">{m.role}</p>
                </li>
              ))}
            </ul>
            <Link href="/issues" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              {t.issue.allIssues}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
