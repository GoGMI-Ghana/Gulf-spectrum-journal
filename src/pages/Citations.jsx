import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { articles, getAuthorsForArticle, getIssueForArticle } from '../data/content'
import { formatApaCitation } from '../utils/citation'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

function CitationRow({ article }) {
  const [copied, setCopied] = useState(false)
  const authors = getAuthorsForArticle(article)
  const issue = getIssueForArticle(article)
  const citation = formatApaCitation(article, authors, issue)

  function handleCopy() {
    navigator.clipboard?.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-5 border-b border-slate-200">
      <Link to={`/articles/${article.slug}`} className="font-semibold text-royal-blue hover:text-ocean-blue">
        {article.title}
      </Link>
      <p className="text-sm text-slate-600 font-mono mt-2 mb-2">{citation}</p>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-blue hover:underline"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy citation'}
      </button>
    </div>
  )
}

export default function Citations() {
  usePageMeta('Citations', 'Ready-to-copy citations for every article published in Gulf Spectrum Journal.')

  return (
    <div>
      <PageBanner eyebrow="Citation Index" title="Citations" description="Formatted APA citations for every published article, generated from real author, issue, and journal data — ready to copy." />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.map((article) => (
          <CitationRow key={article.slug} article={article} />
        ))}
      </section>
    </div>
  )
}
