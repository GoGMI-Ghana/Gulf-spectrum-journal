import Link from 'next/link'
import type { Metadata } from 'next'
import { getIssues, getArticlesForIssue } from '@/lib/content'
import type { Issue } from '@/lib/types'
import { getDictionary, toLocale } from '@/lib/i18n'
import { fmt, plural, rich } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import IssueCover from '@/components/IssueCover'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.issues.metaTitle, description: t.issues.metaDescription }
}

export default async function Issues({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const issues = await getIssues()
  const byYear: Record<number, Issue[]> = {}
  for (const issue of issues) {
    byYear[issue.year] = byYear[issue.year] || []
    byYear[issue.year].push(issue)
  }
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  const articleCounts = await Promise.all(issues.map((i) => getArticlesForIssue(i.slug)))
  const countBySlug = Object.fromEntries(issues.map((i, idx) => [i.slug, articleCounts[idx].length]))

  return (
    <div>
      <PageBanner
        eyebrow={t.issues.eyebrow}
        title={t.issues.title}
        description={rich(t.issues.description, {
          link: (
            <Link href="/topics" className="text-gold hover:underline">
              {t.issues.seeTopics}
            </Link>
          ),
        })}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {years.length === 0 && <p className="text-slate-600">{t.issues.empty}</p>}
        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-lg font-bold text-royal-blue font-display border-b-2 border-royal-blue pb-2 mb-6">{year}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
              {byYear[Number(year)].map((issue) => (
                <Link
                  key={issue.slug}
                  href={`/issues/${issue.slug}`}
                  className="flex gap-5 bg-white p-6 hover:bg-soft-gold/40 transition-colors"
                >
                  <IssueCover issue={issue} className="w-16 shrink-0 shadow" />
                  <div>
                    <p className="kicker text-ocean-blue mb-1.5">
                      {fmt(t.common.volumeShort, { volume: issue.volume, date: issue.publishedDate })}
                    </p>
                    <h3 className="font-semibold text-royal-blue mb-1.5 font-display">{issue.theme}</h3>
                    <p className="text-sm text-slate-500">{plural(locale, t.common.articleCount, countBySlug[issue.slug])}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
