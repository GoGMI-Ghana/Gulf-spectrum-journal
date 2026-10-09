import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, ChevronRight, FileText, Fingerprint, Link2, List, Quote, Users } from 'lucide-react'
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

// Clears the sticky site header when a link jumps to a part of the page.
const ANCHOR = 'scroll-mt-40'
const SECTION_HEADING = 'text-xl font-bold text-royal-blue font-display mb-3'

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
  const authorNames = authors.map((a) => a.name).join(t.common.and)
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
    ...(article.references.length > 0 ? [{ id: 'references', label: t.article.references }] : []),
  ]

  const tabs = [
    { href: '#abstract', label: t.article.fullArticle, icon: FileText, current: true },
    ...(article.references.length > 0 ? [{ href: '#references', label: t.article.references, icon: BookOpen, current: false }] : []),
    { href: '#cite', label: t.article.citeLink, icon: Quote, current: false },
    { href: '#authors', label: t.article.authorsTab, icon: Users, current: false },
  ]

  return (
    <div>
      <ArticleViewLogger articleId={article.id} />

      {/* Where this article sits in the journal */}
      <nav className="bg-royal-blue text-white/90 text-xs">
        <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>
            <Link href="/" className="hover:text-gold">{t.nav.home}</Link>
          </li>
          <ChevronRight size={12} className="text-white/50" />
          <li>
            <Link href="/issues" className="hover:text-gold">{t.nav.articlesAndIssues}</Link>
          </li>
          {issue && (
            <>
              <ChevronRight size={12} className="text-white/50" />
              <li>
                <Link href={`/issues/${issue.slug}`} className="hover:text-gold">{issueLabel}</Link>
              </li>
            </>
          )}
          <ChevronRight size={12} className="text-white/50" />
          <li className="text-white truncate max-w-[16rem] sm:max-w-md">{article.title}</li>
        </ol>
      </nav>

      {/* Title block */}
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-[11rem_minmax(0,1fr)] gap-x-10 gap-y-6">
          {/* Real counts from visits to this page (see ArticleViewLogger). */}
          <dl className="order-2 lg:order-1 flex lg:flex-col gap-x-10 gap-y-4 lg:pt-8">
            <div className="lg:pb-4 lg:border-b lg:border-slate-200">
              <dd className="font-display text-2xl text-royal-blue">{formatNumber(toLocale(locale), stats.views)}</dd>
              <dt className="text-xs text-slate-500">{t.article.views}</dt>
            </div>
            <div>
              <dd className="font-display text-2xl text-royal-blue">{formatNumber(toLocale(locale), stats.downloads)}</dd>
              <dt className="text-xs text-slate-500">{t.article.downloads}</dt>
            </div>
          </dl>

          <div className="order-1 lg:order-2 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
              <p className="text-sm text-slate-500">{t.common.researchArticle}</p>
              {topic && (
                <Link
                  href={`/topics/${topic.slug}`}
                  className="kicker text-royal-blue bg-soft-gold px-2 py-0.5 hover:bg-gold hover:text-ink transition-colors"
                >
                  {topic.label}
                </Link>
              )}
            </div>
            <h1 className="font-display text-royal-blue text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base leading-relaxed mb-2">
              {authors.map((author, i) => (
                <span key={author.slug}>
                  <Link href={`/authors/${author.slug}`} className="text-ocean-blue hover:underline">
                    {author.name}
                  </Link>
                  {i < authors.length - 2 ? ', ' : i === authors.length - 2 ? ' & ' : ''}
                </span>
              ))}
            </p>
            <p className="text-xs text-slate-500 mb-4">
              {[
                issueLabel,
                issue?.publishedDate ? fmt(t.article.publishedOnline, { date: issue.publishedDate }) : '',
                journal.issn ? `ISSN ${journal.issn}` : '',
              ]
                .filter(Boolean)
                .join('  |  ')}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
              <a href="#cite" className="inline-flex items-center gap-1.5 text-ocean-blue hover:underline">
                <Quote size={15} />
                {t.article.citeLink}
              </a>
              {article.doi ? (
                // Shown as the full link, as Crossref requires of its members.
                <a href={doiUrl(article.doi)} className="inline-flex items-center gap-1.5 text-ocean-blue hover:underline break-all">
                  <Fingerprint size={15} />
                  {doiUrl(article.doi)}
                </a>
              ) : (
                // No DOI registered yet: plain text, not a link, and absent
                // from the citations and the Google Scholar tags — a made-up
                // DOI there would be copied into other people's reference lists.
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <Fingerprint size={15} />
                  {t.article.doiPending}
                </span>
              )}
              <a href={url} className="inline-flex items-center gap-1.5 text-ocean-blue hover:underline break-all">
                <Link2 size={15} />
                {url}
              </a>
            </div>

            {/* Jumps to the parts of this page */}
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <ul className="flex flex-wrap gap-x-1 text-sm font-medium">
                {tabs.map((tab) => (
                  <li key={tab.href}>
                    <a
                      href={tab.href}
                      className={`inline-flex items-center gap-1.5 px-4 py-3 transition-colors ${
                        tab.current ? 'bg-royal-blue text-white' : 'text-royal-blue hover:bg-slate-200'
                      }`}
                    >
                      <tab.icon size={15} />
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pb-3">
                <BookmarkButton slug={article.slug} showLabel />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,1fr)_19rem] gap-x-10 gap-y-10">
        {/* In this article */}
        <aside className="hidden lg:block">
          <nav className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto">
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
              className="inline-flex items-center gap-2 bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2 transition-colors"
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
            <h2 className="font-display text-royal-blue text-xl font-bold uppercase tracking-wide mb-4">{t.article.abstract}</h2>
            <p className="text-slate-700 text-[1.05rem] leading-relaxed">{article.abstract}</p>
          </section>

          {article.keywords.length > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 mb-8 text-sm">
              <span className="kicker text-slate-500 mr-1">{t.article.keywords}</span>
              {article.keywords.map((k, i) => (
                <span key={k} className="text-royal-blue">
                  {k}
                  {i < article.keywords.length - 1 && <span className="text-slate-300">;</span>}
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

          {article.references.length > 0 && (
            <section id="references" className={`${ANCHOR} border-t-2 border-royal-blue pt-6 mt-4`}>
              <h2 className="kicker text-royal-blue mb-4">{t.article.references}</h2>
              <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                {article.references.map((ref, i) => (
                  <li key={i} className="leading-relaxed break-words">{ref}</li>
                ))}
              </ol>
            </section>
          )}

          <section id="cite" className={`${ANCHOR} mt-10`}>
            <CiteBox citations={citations} slug={article.slug} />
          </section>

          <DonationThanksBanner />
          <SupportBox authorNames={authorNames} articleSlug={article.slug} />

          {/* Author bios */}
          <section id="authors" className={`${ANCHOR} border-t border-slate-200 pt-8 mt-10`}>
            <h2 className="kicker text-royal-blue mb-6">{t.article.aboutAuthors}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {authors.map((author) => (
                <div key={author.slug} className="flex gap-4">
                  <AuthorAvatar name={author.name} photo={author.photo} size="md" />
                  <div>
                    <Link href={`/authors/${author.slug}`} className="font-semibold text-royal-blue hover:underline">
                      {author.name}
                    </Link>
                    <p className="text-xs text-slate-500 mb-1.5">{author.affiliation}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{author.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Other articles in the same issue */}
        {related.length > 0 && issue && (
          <aside className="lg:col-start-2 xl:col-start-3">
            <div className="xl:sticky xl:top-36">
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
                    <p className="text-xs text-slate-400 mt-0.5">{issueLabel}</p>
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
