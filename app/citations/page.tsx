import Link from 'next/link'
import type { Metadata } from 'next'
import { Quote, Library, Tags, FileCheck2, Sparkles, MousePointerClick } from 'lucide-react'
import { getArticles, getTopics, getAuthorsForArticle, getIssueForArticle, getTopicForArticle, getArticlesForTopic } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import CitationRow from '@/components/CitationRow'
import CitationHeroGrid from '@/components/CitationHeroGrid'

export const metadata: Metadata = {
  title: 'Citations',
  description: 'Ready-to-copy citations for every article published in Gulf Spectrum Journal.',
}

const featureCards = [
  {
    icon: Quote,
    title: 'Citations',
    subtitle: 'Verified, APA-formatted',
    body: 'Author, issue, and journal data pulled directly from the article — no manual formatting.',
  },
  {
    icon: Library,
    title: 'References',
    subtitle: 'Every source cited',
    body: "See what each article draws on — the full reference list is on every article page.",
  },
  {
    icon: Tags,
    title: 'Topics',
    subtitle: 'Browse by subject',
    body: 'Filter citations by maritime security, governance, capacity building, and more.',
  },
]

const bottomFeatures = [
  { icon: FileCheck2, label: 'Every article indexed' },
  { icon: Sparkles, label: 'APA formatted, automatically' },
  { icon: MousePointerClick, label: 'Copy in one click' },
]

export default async function Citations() {
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
        issueLabel: issue ? `Issue ${issue.number} · ${issue.year}` : undefined,
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
          <p className="kicker text-ocean-blue mb-4">Citation Index</p>
          <h1 className="font-display text-royal-blue text-4xl sm:text-5xl leading-tight mb-4">
            {totalReferences} sources cited across{' '}
            <span className="text-gold">Gulf Spectrum Journal</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
            Every published article, fully referenced and ready to cite — generated
            from real author, issue, and journal data, not estimated.
          </p>
          <a
            href="#citation-list"
            className="inline-block bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 transition-colors tracking-wide"
          >
            Browse the Citation Index →
          </a>
        </div>
        <CitationHeroGrid />
      </section>

      {/* Feature cards */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featureCards.map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 p-6">
              <f.icon className="text-ocean-blue mb-3" size={24} />
              <h3 className="font-semibold text-royal-blue">{f.title}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{f.subtitle}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inside the citation index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-royal-blue text-3xl text-center mb-14">
          Inside the Citation Index
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="text-xl font-bold text-royal-blue font-display mb-2">Track the corpus</h3>
            <p className="text-slate-600 leading-relaxed">
              See total citations available, and how the corpus is growing issue by issue.
            </p>
          </div>
          <div className="border border-slate-200 divide-y divide-slate-200">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">Total citations</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{totalReferences}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">Articles indexed</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{articles.length}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">Topics covered</span>
              <span className="numeral text-2xl font-bold text-royal-blue">{topics.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="border border-slate-200 p-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                  <th className="px-4 py-2 font-medium">Topic</th>
                  <th className="px-4 py-2 font-medium text-right">Articles</th>
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
            <h3 className="text-xl font-bold text-royal-blue font-display mb-2">See where citations land</h3>
            <p className="text-slate-600 leading-relaxed">
              Citations broken down by topic, so you can find what&apos;s been written on a
              given subject at a glance — and where the corpus is still thin.
            </p>
          </div>
        </div>
      </section>

      {/* Trust line */}
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-white/70 text-sm">
            Every citation on this page is generated from Gulf Spectrum Journal&apos;s own
            published data — no external scraping, no estimates.
          </p>
        </div>
      </section>

      {/* Citation list */}
      <section id="citation-list" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <h2 className="font-display text-royal-blue text-2xl mb-8 pb-3 border-b-2 border-royal-blue">
          Explore Citations
        </h2>
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
            <h3 className="font-display text-2xl text-gold mb-2">Support the research behind these citations</h3>
            <p className="text-white/75 max-w-xl">
              Become a GoGMI member to back the researchers publishing in Gulf Spectrum
              Journal — or donate directly to an article&apos;s authors from its page.
            </p>
          </div>
          <Link
            href="/membership"
            className="shrink-0 bg-gold hover:bg-soft-gold text-ink font-semibold px-6 py-3 transition-colors tracking-wide whitespace-nowrap"
          >
            Explore Membership →
          </Link>
        </div>
      </section>

      {/* Bottom features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {bottomFeatures.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <f.icon className="text-gold" size={26} />
              <p className="text-sm font-medium text-slate-700">{f.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
