import Link from 'next/link'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import { getIssues, getTopics, getArticlesForIssue } from '@/lib/content'
import { journal } from '@/lib/staticContent'
import IssueContents from '@/components/IssueContents'
import IssueCover from '@/components/IssueCover'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { description: t.home.metaDescription }
}

// Opens the way a printed journal does: the current issue's cover and its
// table of contents. The masthead above already names the journal and
// GoGMI, so this page doesn't repeat them.
export default async function Home({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const issues = await getIssues()
  const topics = await getTopics()
  // Undefined until the first issue is published — every section below
  // that depends on it has an empty state rather than assuming it exists.
  const latestIssue = issues.at(0)
  const latestArticles = latestIssue ? await getArticlesForIssue(latestIssue.slug) : []
  const pastIssues = issues.slice(1)

  return (
    <div>
      <h1 className="sr-only">Gulf Spectrum Journal</h1>

      {/* Current issue */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {latestIssue ? (
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] sm:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)] gap-x-6 sm:gap-x-10 gap-y-6 items-start">
              <Link href={`/issues/${latestIssue.slug}`} className="block border border-slate-300 hover:opacity-90 transition-opacity">
                <IssueCover issue={latestIssue} sizes="(max-width: 640px) 112px, 208px" priority />
              </Link>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gold-ink">{t.home.currentIssue}</p>
                <h2 className="font-display text-royal-blue text-2xl sm:text-4xl leading-tight mt-1">
                  <Link href={`/issues/${latestIssue.slug}`} className="hover:underline underline-offset-4 decoration-2">
                    {latestIssue.theme}
                  </Link>
                </h2>
                <p className="text-slate-600 mt-2">
                  {fmt(t.article.volumeIssue, { volume: latestIssue.volume, number: latestIssue.number })} · {latestIssue.publishedDate}
                </p>
                <p className="hidden sm:block text-slate-700 leading-relaxed mt-4 max-w-3xl">
                  {latestIssue.aboutThisVolume}
                </p>
                <div className="hidden sm:flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
                  <Link
                    href={`/issues/${latestIssue.slug}`}
                    className="bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-3 transition-colors"
                  >
                    {t.home.viewIssue}
                  </Link>
                  {latestArticles.length > 0 && (
                    // A plain <a>: /api paths aren't pages for next/link to route to.
                    <a
                      href={`/api/issues/${latestIssue.slug}/pdf`}
                      download
                      className="inline-flex items-center gap-2 py-3 font-medium text-royal-blue hover:text-ocean-blue hover:underline underline-offset-2"
                    >
                      <Download size={17} aria-hidden="true" />
                      {t.issue.downloadPdf}
                    </a>
                  )}
                </div>
              </div>
              {/* On a phone the cover sits beside the title, and the
                  description and buttons run full width below them. */}
              <div className="sm:hidden col-span-2">
                <p className="text-slate-700 leading-relaxed line-clamp-5">{latestIssue.aboutThisVolume}</p>
                <div className="flex flex-col gap-1 mt-4">
                  <Link
                    href={`/issues/${latestIssue.slug}`}
                    className="bg-royal-blue text-white font-semibold px-5 py-3 text-center"
                  >
                    {t.home.viewIssue}
                  </Link>
                  {latestArticles.length > 0 && (
                    <a
                      href={`/api/issues/${latestIssue.slug}/pdf`}
                      download
                      className="inline-flex items-center justify-center gap-2 py-3 font-medium text-royal-blue"
                    >
                      <Download size={17} aria-hidden="true" />
                      {t.issue.downloadPdf}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <h2 className="font-display text-royal-blue text-3xl">{t.home.emptyHeading}</h2>
              <p className="text-slate-700 leading-relaxed mt-3">{t.home.emptyBody}</p>
              <Link href="/submissions" className="inline-block mt-6 bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-3">
                {t.home.submitHeading}
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-x-14 gap-y-12">
        {/* Table of contents */}
        <section>
          {latestIssue && latestArticles.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-royal-blue mb-4">{t.issue.inThisIssue}</h2>
              <IssueContents articles={latestArticles} />
            </>
          )}

          {pastIssues.length > 0 && (
            <div className="mt-14">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-display text-2xl text-royal-blue">{t.home.browseArticlesIssues}</h2>
                <Link href="/issues" className="text-ocean-blue font-medium hover:underline whitespace-nowrap">
                  {t.home.viewAll}
                </Link>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {pastIssues.map((issue) => (
                  <li key={issue.slug}>
                    <Link href={`/issues/${issue.slug}`} className="group block">
                      <IssueCover issue={issue} className="border border-slate-300" />
                      <p className="text-sm text-slate-600 mt-2">
                        {fmt(t.article.volumeIssue, { volume: issue.volume, number: issue.number })}
                      </p>
                      <p className="font-display text-royal-blue leading-snug group-hover:underline">{issue.theme}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* About, for authors, topics: plain lists, not boxes */}
        <aside className="space-y-10 text-[0.9375rem]">
          <section>
            <h2 className="font-display text-lg text-royal-blue pb-2 border-b border-slate-300">{t.home.aboutJournal}</h2>
            <p className="text-slate-700 leading-relaxed mt-3">{t.home.aboutBody}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {journal.issn && (
                <>
                  <dt className="text-slate-600">{t.about.issn}</dt>
                  <dd className="text-slate-900">{journal.issn}</dd>
                </>
              )}
              <dt className="text-slate-600">{t.about.publisher}</dt>
              <dd className="text-slate-900">{journal.publisher}</dd>
              <dt className="text-slate-600">{t.about.founded}</dt>
              <dd className="text-slate-900">{journal.founded}</dd>
            </dl>
            <Link href="/about" className="inline-block mt-4 text-ocean-blue font-medium hover:underline">
              {t.home.learnMore}
            </Link>
          </section>

          <section>
            <h2 className="font-display text-lg text-royal-blue pb-2 border-b border-slate-300">{t.home.forAuthors}</h2>
            <ul className="mt-2">
              <li>
                <Link href="/submissions" className="block py-2 text-ocean-blue hover:underline">
                  {t.home.viewGuidelines}
                </Link>
              </li>
              <li>
                <Link href="/editorial-board/apply" className="block py-2 text-ocean-blue hover:underline">
                  {t.home.applyBoard}
                </Link>
              </li>
              <li>
                <Link href="/correction-policy" className="block py-2 text-ocean-blue hover:underline">
                  {t.footer.correctionPolicy}
                </Link>
              </li>
            </ul>
          </section>

          {topics.length > 0 && (
            <section>
              <h2 className="font-display text-lg text-royal-blue pb-2 border-b border-slate-300">{t.home.browseByTopic}</h2>
              <ul className="mt-2">
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link href={`/topics/${topic.slug}`} className="block py-2 text-ocean-blue hover:underline">
                      {topic.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
