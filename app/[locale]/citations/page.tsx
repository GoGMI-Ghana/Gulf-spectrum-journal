import Link from 'next/link'
import type { Metadata } from 'next'
import { TextQuote, Library, Tags, FileCheck2, Sparkles, MousePointerClick } from 'lucide-react'
import { getArticles, getTopics, getAuthorsForArticle, getIssueForArticle, getTopicForArticle, getArticlesForTopic } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import { getDictionary } from '@/lib/i18n'
import { fmt, rich } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import CitationRow from '@/components/CitationRow'
import CitationHeroGrid from '@/components/CitationHeroGrid'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.citations.metaTitle, description: t.citations.metaDescription }
}

const featureIcons = [TextQuote, Library, Tags]

const bottomFeatureIcons = [FileCheck2, Sparkles, MousePointerClick]

export default async function Citations({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const articles = await getArticles()
  const topics = await getTopics()
  const rows = await Promise.all(
    articles.map(async (article) => {
      const authors = await getAuthorsForArticle(article)
      const issue = await getIssueForArticle(article)
      const topic = await getTopicForArticle(article)
      return {
        slug: article.slug,
        title: article.title,
        citation: formatApaCitation(article, authors, issue),
        authorNames: authors.map((a) => a.name).join(', '),
        topicLabel: topic?.label,
        issueLabel: issue ? fmt(t.citations.issueLabel, { number: issue.number, year: issue.year }) : undefined,
      }
    })
  )

  const totalReferences = articles.reduce((sum, a) => sum + a.references.length, 0)
  const topicBreakdown = await Promise.all(
    topics.map(async (t) => ({ label: t.label, count: (await getArticlesForTopic(t.slug)).length }))
  )

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="kicker text-ocean-blue mb-4">{t.citations.kicker}</p>
          <h1 className="font-display text-royal-blue text-4xl sm:text-5xl leading-tight mb-4">
            {rich(t.citations.heading, {
              count: totalReferences,
              journal: <span className="text-gold">Gulf Spectrum Journal</span>,
            })}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
            {t.citations.intro}
          </p>
          <a
            href="#citation-list"
            className="inline-block bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 transition-colors tracking-wide"
          >
            {t.citations.browseIndex}
          </a>
        </div>
        <CitationHeroGrid />
      </section>

      {/* Feature cards */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {t.citations.featureCards.map((f, i) => {
            const Icon = featureIcons[i]
            return (
              <div key={f.title} className="bg-white border border-slate-200 p-6">
                <Icon className="text-ocean-blue mb-3" size={20} />
                <h3 className="font-semibold text-royal-blue">{f.title}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{f.subtitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Inside the citation index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-royal-blue text-3xl text-center mb-14">
          {t.citations.insideHeading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="text-xl font-bold text-royal-blue font-display mb-2">{t.citations.trackHeading}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t.citations.trackBody}
            </p>
          </div>
          <div className="border border-slate-200 divide-y divide-slate-200">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">{t.citations.totalCitations}</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{totalReferences}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">{t.citations.articlesIndexed}</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{articles.length}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">{t.citations.topicsCovered}</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{topics.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="border border-slate-200 p-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                  <th className="px-4 py-2 font-medium">{t.citations.colTopic}</th>
                  <th className="px-4 py-2 font-medium text-right">{t.citations.colArticles}</th>
                </tr>
              </thead>
              <tbody>
                {topicBreakdown.map((t) => (
                  <tr key={t.label} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">{t.label}</td>
                    <td className="px-4 py-2.5 text-right numeral text-royal-blue font-medium">{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-xl font-bold text-royal-blue font-display mb-2">{t.citations.whereHeading}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t.citations.whereBody}
            </p>
          </div>
        </div>
      </section>

      {/* Trust line */}
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-white/70 text-sm">
            {t.citations.trustLine}
          </p>
        </div>
      </section>

      {/* Citation list */}
      <section id="citation-list" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <h2 className="font-display text-royal-blue text-2xl mb-8 pb-3 border-b-2 border-royal-blue">
          {t.citations.exploreHeading}
        </h2>
        {rows.length === 0 && <p className="text-slate-600">{t.citations.empty}</p>}
        <div className="space-y-5">
          {rows.map((row) => (
            <CitationRow key={row.slug} {...row} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-royal-blue text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-gold">
          <div>
            <h3 className="font-display text-2xl text-gold mb-2">{t.citations.ctaHeading}</h3>
            <p className="text-white/75 max-w-xl">
              {t.citations.ctaBody}
            </p>
          </div>
          <Link
            href="/issues"
            className="shrink-0 bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 transition-colors tracking-wide whitespace-nowrap"
          >
            {t.citations.browseArticles}
          </Link>
        </div>
      </section>

      {/* Bottom features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {t.citations.bottomFeatures.map((label, i) => {
            const Icon = bottomFeatureIcons[i]
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="text-gold" size={22} />
                <p className="text-sm font-medium text-slate-700">{label}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
