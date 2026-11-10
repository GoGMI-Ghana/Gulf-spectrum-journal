import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, ChartNoAxesColumn, ChevronRight, FileText, Fingerprint, List, Quote, Users } from 'lucide-react'
import {
  getArticles,
  getArticleBySlug,
  getArticlesForIssue,
  getAuthorsForArticle,
  getIssueForArticle,
  getTopicForArticle,
} from '@/lib/content'
import { getArticleStatsById } from '@/lib/analytics'
import { formatCitations } from '@/lib/citation'
import { doiUrl } from '@/lib/doi'
import { referenceParts } from '@/lib/references'
import { getDictionary, toLocale } from '@/lib/i18n'
import { fmt, formatNumber } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { siteUrl, socialMetadata } from '@/lib/seo'
import { journal } from '@/lib/staticContent'
import AuthorAvatar from '@/components/AuthorAvatar'
import BookmarkButton from '@/components/BookmarkButton'
import DownloadPdfButton from '@/components/DownloadPdfButton'
import ShareBar from '@/components/ShareBar'
import RichText from '@/components/RichText'
import CiteBox from '@/components/CiteBox'
import SupportBox from '@/components/SupportBox'
import DonationThanksBanner from '@/components/DonationThanksBanner'
import ArticleViewLogger from '@/components/ArticleViewLogger'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: LocaleSlugParams): Promise<Metadata> {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const article = await getArticleBySlug(slug)
  if (!article) return { title: t.article.notFound }
  const [authors, issue] = await Promise.all([getAuthorsForArticle(article), getIssueForArticle(article)])
  return {
    title: article.title,
    description: article.abstract,
    // The tags Google Scholar reads to index an article and cite it correctly.
    other: {
      citation_title: article.title,
      citation_author: authors.map((a) => a.name),
      citation_journal_title: journal.name,
      citation_publisher: journal.publisher,
      ...(journal.issn && { citation_issn: journal.issn }),
      ...(article.doi && { citation_doi: article.doi }),
      ...(issue && {
        citation_publication_date: /^\d{4}-\d{2}-\d{2}/.test(issue.publishedDate)
          ? issue.publishedDate.slice(0, 10).replace(/-/g, '/')
          : String(issue.year),
        citation_volume: issue.volume,
        citation_issue: issue.number,
      }),
      citation_abstract_html_url: `${siteUrl}/articles/${article.slug}`,
      citation_pdf_url: `${siteUrl}/api/articles/${article.slug}/pdf`,
    },
    ...socialMetadata({
      title: article.title,
      description: article.abstract,
      path: `/articles/${article.slug}`,
      image: `/api/og/article/${article.slug}`,
      type: 'article',
    }),
  }
}

// A little room above a section when a link jumps to it.
const ANCHOR = 'scroll-mt-6'
const SECTION_HEADING = 'text-2xl text-royal-blue font-display mb-4'

export default async function ArticleDetail({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const [authors, issue, topic, statsById] = await Promise.all([
    getAuthorsForArticle(article),
    getIssueForArticle(article),
    getTopicForArticle(article),
    getArticleStatsById(),
  ])
  const url = `${siteUrl}/articles/${article.slug}`
  // Once an article has a DOI, that is the address to cite: it keeps
  // working even if the site's own addresses change.
  const citations = formatCitations(article, authors, issue, article.doi ? doiUrl(article.doi) : url)
  const stats = statsById[article.id] ?? { views: 0, downloads: 0 }
  const issueLabel = issue ? fmt(t.article.volumeIssue, { volume: issue.volume, number: issue.number }) : ''

  const related = issue ? (await getArticlesForIssue(issue.slug)).filter((a) => a.slug !== article.slug).slice(0, 4) : []
  const relatedAuthors = await Promise.all(related.map((a) => getAuthorsForArticle(a)))

  // The "In this article" list: one entry per part of the page that exists.
  const contents = [
    { id: 'abstract', label: t.article.abstract },
    ...article.sections.flatMap((section, i) => (section.heading ? [{ id: `section-${i + 1}`, label: section.heading }] : [])),
    ...(article.conclusion ? [{ id: 'conclusion', label: t.article.conclusion }] : []),
    ...(article.disclosure ? [{ id: 'disclosure', label: t.article.disclosure }] : []),
    { id: 'authors', label: t.article.aboutAuthors },
    ...(article.references.length > 0 ? [{ id: 'references', label: t.article.references }] : []),
  ]

  // Same order as the sections on the page.
  const tabs = [
    { href: '#abstract', label: t.article.fullArticle, icon: FileText, current: true },
    { href: '#authors', label: t.article.authorsTab, icon: Users, current: false },
    ...(article.references.length > 0 ? [{ href: '#references', label: t.article.references, icon: BookOpen, current: false }] : []),
    { href: '#cite', label: t.article.citeLink, icon: Quote, current: false },
    { href: '#metrics', label: t.article.metrics, icon: ChartNoAxesColumn, current: false },
  ]

  return (
    <div>
      <ArticleViewLogger articleId={article.id} />

      {/* Title block */}
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[11rem_minmax(0,1fr)] gap-x-10">
          <div className="lg:col-start-2 min-w-0 pt-5 sm:pt-6">
            {/* Where this article sits in the journal */}
            <nav aria-label={t.article.breadcrumbLabel} className="text-sm text-slate-600 mb-6">
              <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <li>
                  <Link href="/issues" className="hover:text-ocean-blue hover:underline">{t.nav.articlesAndIssues}</Link>
                </li>
                {issue && (
                  <>
                    <ChevronRight size={14} className="text-slate-500" aria-hidden="true" />
                    <li>
                      <Link href={`/issues/${issue.slug}`} className="hover:text-ocean-blue hover:underline">{issueLabel}</Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <p className="text-sm text-slate-600 mb-2">
              {t.common.researchArticle}
              {topic && (
                <>
                  {' · '}
                  <Link href={`/topics/${topic.slug}`} className="text-gold-ink hover:underline">
                    {topic.label}
                  </Link>
                </>
              )}
            </p>
            <h1 className="font-display text-royal-blue text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.15] mb-5">
              {article.title}
            </h1>

            <p className="text-lg leading-relaxed mb-2">
              {authors.map((author, i) => (
                <span key={author.slug}>
                  <Link href={`/authors/${author.slug}`} className="text-ocean-blue hover:underline">
                    {author.name}
                  </Link>
                  {i < authors.length - 2 ? ', ' : i === authors.length - 2 ? ' & ' : ''}
                </span>
              ))}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              {[
                issue ? `${journal.name}, ${issueLabel}` : journal.name,
                issue?.publishedDate ? fmt(t.article.publishedOnline, { date: issue.publishedDate }) : '',
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <p className="text-sm mb-6">
              {article.doi ? (
                // Shown as the full link, as Crossref requires of its members.
                <a href={doiUrl(article.doi)} className="inline-flex items-center gap-1.5 text-ocean-blue hover:underline break-all">
                  <Fingerprint size={15} aria-hidden="true" />
                  {doiUrl(article.doi)}
                </a>
              ) : (
                // No DOI registered yet: plain text, not a link, and absent
                // from the citations and the Google Scholar tags — a made-up
                // DOI there would be copied into other people's reference lists.
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <Fingerprint size={15} aria-hidden="true" />
                  {t.article.doiPending}
                </span>
              )}
            </p>

            {/* Jumps to the parts of this page */}
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <ul className="flex flex-wrap gap-x-1 -mx-4 sm:mx-0 text-sm font-medium">
                {tabs.map((tab) => (
                  <li key={tab.href}>
                    <a
                      href={tab.href}
                      className={`inline-flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors ${
                        tab.current ? 'border-royal-blue text-royal-blue' : 'border-transparent text-slate-700 hover:text-royal-blue hover:border-slate-300'
                      }`}
                    >
                      <tab.icon size={15} aria-hidden="true" />
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pb-2">
                <BookmarkButton slug={article.slug} showLabel />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,1fr)_19rem] gap-x-10 gap-y-10">
        {/* In this article */}
        <aside className="hidden lg:block">
          <nav className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800 pb-3 border-b border-slate-200">
              <List size={16} />
              {t.article.inThisArticle}
            </h2>
            <ul className="text-sm">
              {contents.map((entry) => (
                <li key={entry.id} className="border-b border-slate-200">
                  <a href={`#${entry.id}`} className="block py-3 font-medium text-royal-blue hover:text-ocean-blue">
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* The article */}
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <DownloadPdfButton
              articleId={article.id}
              slug={article.slug}
              className="inline-flex items-center gap-2 bg-royal-blue hover:bg-ocean-blue text-white font-semibold px-5 py-3 transition-colors"
            />
          </div>

          {/* Shown before anything else in the article: a reader must not be
              able to miss that what follows was changed after publication. */}
          {article.correctionNote && (
            <div className="border-l-4 border-amber-400 bg-amber-50 p-4 mb-8">
              <p className="kicker text-amber-800 mb-1.5">{t.article.correction}</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{article.correctionNote}</p>
              <Link href="/correction-policy" className="inline-block mt-2 text-xs text-ocean-blue hover:underline">
                {t.article.correctionPolicyLink}
              </Link>
            </div>
          )}

          <section id="abstract" className={`${ANCHOR} mb-6`}>
            <h2 className={SECTION_HEADING}>{t.article.abstract}</h2>
            <p className="font-display text-slate-800 text-[1.0625rem] leading-[1.7]">{article.abstract}</p>
          </section>

          {article.keywords.length > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 mb-8 text-sm">
              <span className="font-semibold text-slate-800 mr-1">{t.article.keywords}:</span>
              {article.keywords.map((k, i) => (
                <span key={k} className="text-royal-blue">
                  {k}
                  {i < article.keywords.length - 1 && <span className="text-slate-500">;</span>}
                </span>
              ))}
            </div>
          )}

          <div className="mb-10">
            <ShareBar title={article.title} url={url} />
          </div>

          {/* Body */}
          <div className="prose max-w-none">
            {article.sections.map((section, i) => (
              <section key={i} id={`section-${i + 1}`} className={`${ANCHOR} mb-8`}>
                {section.heading && <h2 className={SECTION_HEADING}>{section.heading}</h2>}
                <RichText value={section.body} />
              </section>
            ))}

            {article.conclusion && (
              <section id="conclusion" className={`${ANCHOR} mb-8`}>
                <h2 className={SECTION_HEADING}>{t.article.conclusion}</h2>
                <RichText value={article.conclusion} />
              </section>
            )}

            {article.disclosure && (
              <section id="disclosure" className={`${ANCHOR} mb-8`}>
                <h2 className={SECTION_HEADING}>{t.article.disclosure}</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{article.disclosure}</p>
              </section>
            )}
          </div>

          {/* About the authors: after the text and before the references,
              where journals put author information. A bio line only when
              the author has written one. */}
          <section id="authors" className={`${ANCHOR} border-t border-slate-300 pt-8 mt-6`}>
            <h2 className={SECTION_HEADING}>{t.article.aboutAuthors}</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {authors.map((author) => (
                <li key={author.slug} className="flex gap-4">
                  <AuthorAvatar name={author.name} photo={author.photo} size="md" className="rounded-full" />
                  <div className="min-w-0">
                    <Link href={`/authors/${author.slug}`} className="font-semibold text-royal-blue hover:underline">
                      {author.name}
                    </Link>
                    {author.affiliation && <p className="text-sm text-slate-600 mt-0.5">{author.affiliation}</p>}
                    {author.bio && <p className="text-sm text-slate-700 leading-relaxed mt-2 line-clamp-4">{author.bio}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {article.references.length > 0 && (
            <section id="references" className={`${ANCHOR} border-t border-slate-300 pt-8 mt-6`}>
              <h2 className={SECTION_HEADING}>{t.article.references}</h2>
              <ol className="space-y-2.5 text-[0.9375rem] text-slate-700 list-decimal pl-6 marker:text-slate-500">
                {article.references.map((ref, i) => (
                  <li key={i} className="leading-relaxed break-words">
                    {referenceParts(ref).map((part, j) =>
                      part.href ? (
                        <a key={j} href={part.href} target="_blank" rel="noopener noreferrer" className="text-ocean-blue hover:underline">
                          {part.text}
                        </a>
                      ) : (
                        part.text
                      )
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="cite" className={`${ANCHOR} mt-10`}>
            <CiteBox citations={citations} slug={article.slug} />
          </section>

          {/* Real counts from visits to this page (see ArticleViewLogger). */}
          <section id="metrics" className={`${ANCHOR} border-t border-slate-200 pt-8 mt-10`}>
            <h2 className={SECTION_HEADING}>{t.article.metrics}</h2>
            <dl className="flex gap-x-12">
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-slate-600">{t.article.views}</dt>
                <dd className="font-display text-3xl text-royal-blue">{formatNumber(toLocale(locale), stats.views)}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-slate-600">{t.article.downloads}</dt>
                <dd className="font-display text-3xl text-royal-blue">{formatNumber(toLocale(locale), stats.downloads)}</dd>
              </div>
            </dl>
          </section>

          {/* Last, once the reader has finished: the way news and open-access
              sites ask for support, rather than interrupting the article. */}
          <DonationThanksBanner />
          <SupportBox authors={authors} articleSlug={article.slug} />
        </article>

        {/* Other articles in the same issue */}
        {related.length > 0 && issue && (
          <aside className="lg:col-start-2 xl:col-start-3">
            <div className="xl:sticky xl:top-6">
              <h2 className="font-display text-xl text-slate-800 mb-3">{t.article.relatedHeading}</h2>
              <ul className="border-t-4 border-royal-blue">
                {related.map((other, i) => (
                  <li key={other.slug} className="py-4 border-b border-slate-200">
                    <Link href={`/articles/${other.slug}`} className="font-medium text-royal-blue hover:text-ocean-blue leading-snug">
                      {other.title}
                    </Link>
                    <p className="text-sm text-slate-600 mt-2">
                      {relatedAuthors[i].length > 2
                        ? `${relatedAuthors[i][0].name} et al.`
                        : relatedAuthors[i].map((a) => a.name).join(t.common.and)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{issueLabel}</p>
                  </li>
                ))}
              </ul>
              <Link href={`/issues/${issue.slug}`} className="inline-block mt-4 text-sm font-medium text-ocean-blue hover:underline">
                {t.article.viewIssue}
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
