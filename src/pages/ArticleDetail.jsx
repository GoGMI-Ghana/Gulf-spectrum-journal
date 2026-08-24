import { Link, useParams, Navigate } from 'react-router-dom'
import { getArticleBySlug, getAuthorsForArticle, getIssueForArticle } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import Initials from '../components/Initials'

// Minimal generic glyphs for social share targets (lucide-react no longer ships brand icons).
function XGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-7l-5.5-6.8L4.2 22H1l8.2-9.3L1 2h7.2l5 6.2L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z" />
    </svg>
  )
}
function FacebookGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M14 8.5h2.5V5.3c-.4-.05-1.9-.18-3.6-.18-3.6 0-6 2.2-6 6.2v3.2H3.5V18h3.4v9h3.9v-9H14l.6-3.5h-3.7v-2.8c0-1 .3-1.7 1.8-1.7Z" transform="translate(0 -1)" />
    </svg>
  )
}
function LinkedInGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  )
}

function ShareBar({ title }) {
  const shareText = encodeURIComponent(title)
  return (
    <div className="flex items-center gap-4 py-3 border-y border-slate-200">
      <span className="kicker text-slate-500">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <XGlyph />
      </a>
      <a
        href="https://www.facebook.com/sharer/sharer.php"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <FacebookGlyph />
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="text-slate-500 hover:text-royal-blue transition-colors"
      >
        <LinkedInGlyph />
      </a>
    </div>
  )
}

export default function ArticleDetail() {
  const { articleSlug } = useParams()
  const article = getArticleBySlug(articleSlug)

  usePageMeta(article?.title, article?.abstract)

  if (!article) return <Navigate to="/issues" replace />

  const authors = getAuthorsForArticle(article)
  const issue = getIssueForArticle(article)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-1.5">
        <Link to="/issues" className="hover:text-ocean-blue">Issues</Link>
        <span>/</span>
        {issue && (
          <>
            <Link to={`/issues/${issue.slug}`} className="hover:text-ocean-blue">
              Issue {issue.number}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-700">Article</span>
      </nav>

      <p className="kicker text-ocean-blue mb-3">Research Article</p>
      <h1 className="font-display text-royal-blue text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6">
        {article.title}
      </h1>

      {/* Authors */}
      <div className="flex flex-wrap gap-5 mb-6">
        {authors.map((author) => (
          <Link
            key={author.slug}
            to={`/authors/${author.slug}`}
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
                <Link to={`/authors/${author.slug}`} className="font-semibold text-royal-blue hover:underline">
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
