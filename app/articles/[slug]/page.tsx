import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticles, getArticleBySlug, getAuthorsForArticle, getIssueForArticle, getTopicForArticle } from '@/lib/content'
import { formatApaCitation } from '@/lib/citation'
import Initials from '@/components/Initials'
import BookmarkButton from '@/components/BookmarkButton'
import ShareBar from '@/components/ShareBar'
import CiteBox from '@/components/CiteBox'
import SupportBox from '@/components/SupportBox'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article not found' }
  return { title: article.title, description: article.abstract }
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const authors = await getAuthorsForArticle(article)
  const issue = await getIssueForArticle(article)
  const topic = await getTopicForArticle(article)
  const citation = formatApaCitation(article, authors, issue)
  const authorNames = authors.map((a) => a.name).join(' and ')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-1.5">
        <Link href="/issues" className="hover:text-ocean-blue">Articles and Issues</Link>
        <span>/</span>
        {issue && (
          <>
            <Link href={`/issues/${issue.slug}`} className="hover:text-ocean-blue">
              Issue {issue.number}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-700">Article</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="kicker text-ocean-blue">Research Article</p>
          {topic && (
            <Link
              href={`/topics/${topic.slug}`}
              className="kicker text-royal-blue bg-soft-gold px-2 py-0.5 hover:bg-gold hover:text-ink transition-colors"
            >
              {topic.label}
            </Link>
          )}
        </div>
        <BookmarkButton slug={article.slug} showLabel />
      </div>
      <h1 className="font-display text-royal-blue text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6">
        {article.title}
      </h1>

      {/* Authors */}
      <div className="flex flex-wrap gap-5 mb-6">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/authors/${author.slug}`}
            className="flex items-center gap-3 group"
          >
            <Initials name={author.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-royal-blue group-hover:underline">{author.name}</p>
              <p className="text-xs text-slate-500">{author.affiliation}</p>
            </div>
          </Link>
        ))}
      </div>

      <ShareBar title={article.title} />

      {/* Abstract */}
      <div className="border-l-4 border-royal-blue bg-slate-50 p-6 my-8">
        <h2 className="kicker text-royal-blue mb-3">Abstract</h2>
        <p className="text-slate-700 leading-relaxed">{article.abstract}</p>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 mb-10 text-sm">
        <span className="kicker text-slate-500 mr-1">Keywords —</span>
        {article.keywords.map((k, i) => (
          <span key={k} className="text-royal-blue">
            {k}
            {i < article.keywords.length - 1 && <span className="text-slate-300">;</span>}
          </span>
        ))}
      </div>

      <CiteBox citation={citation} />
      <SupportBox authorNames={authorNames} />

      {/* Body */}
      <div className="prose max-w-none">
        {article.sections.map((section) => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-xl font-bold text-royal-blue font-display mb-3">{section.heading}</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ))}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-royal-blue font-display mb-3">Conclusion</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{article.conclusion}</p>
        </div>
      </div>

      {/* References */}
      <div className="border-t-2 border-royal-blue pt-6 mt-4">
        <h2 className="kicker text-royal-blue mb-4">References</h2>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          {article.references.map((ref, i) => (
            <li key={i} className="leading-relaxed">{ref}</li>
          ))}
        </ol>
      </div>

      {/* Author bios */}
      <div className="border-t border-slate-200 pt-8 mt-10">
        <h2 className="kicker text-royal-blue mb-6">About the Authors</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {authors.map((author) => (
            <div key={author.slug} className="flex gap-4">
              <Initials name={author.name} size="md" />
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
      </div>
    </div>
  )
}
