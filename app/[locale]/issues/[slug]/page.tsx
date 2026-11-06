import Link from 'next/link'
import { Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getIssues, getIssueBySlug, getArticlesForIssue } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { socialMetadata } from '@/lib/seo'
import IssueContents from '@/components/IssueContents'
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
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-[6rem_minmax(0,1fr)] sm:grid-cols-[10rem_minmax(0,1fr)] gap-x-6 sm:gap-x-10 items-start">
          <IssueCover issue={issue} className="border border-slate-300" sizes="(max-width: 640px) 96px, 160px" priority />
          <div className="min-w-0">
            <p className="text-slate-600">
              {fmt(t.issue.volume, { volume: issue.volume, date: issue.publishedDate })}
            </p>
            <h1 className="font-display text-royal-blue text-2xl sm:text-4xl leading-tight mt-1">{issue.theme}</h1>
            <p className="hidden sm:block text-slate-700 max-w-3xl leading-relaxed mt-4">{issue.aboutThisVolume}</p>
            {articles.length > 0 && (
              // Generated on request (app/api/issues/[slug]/pdf). A plain <a>:
              // /api paths aren't pages for next/link to route to.
              <a
                href={`/api/issues/${issue.slug}/pdf`}
                download
                className="inline-flex items-center gap-2 mt-5 bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-3 transition-colors"
              >
                <Download size={17} aria-hidden="true" />
                {t.issue.downloadPdf}
              </a>
            )}
          </div>
          <p className="sm:hidden col-span-2 text-slate-700 leading-relaxed mt-5">{issue.aboutThisVolume}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-x-14 gap-y-12">
        <div>
          <h2 className="font-display text-2xl text-royal-blue mb-4">{t.issue.inThisIssue}</h2>
          <IssueContents articles={articles} />
        </div>

        <aside>
          {issue.editorialBoard.length > 0 && (
            <>
              <h2 className="font-display text-lg text-royal-blue pb-2 border-b border-slate-300">{t.issue.issueBoard}</h2>
              <ul className="mt-2">
                {issue.editorialBoard.map((m) => (
                  <li key={m.name} className="py-2.5 border-b border-slate-200">
                    <p className="font-medium text-slate-900">{m.name}</p>
                    <p className="text-slate-600 text-sm">{m.role}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link href="/issues" className="inline-block mt-5 text-ocean-blue font-medium hover:underline">
            {t.issue.allIssues}
          </Link>
        </aside>
      </section>
    </div>
  )
}
