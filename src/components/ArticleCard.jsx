import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { getAuthorsForArticle } from '../data/content'

export default function ArticleCard({ article, issue }) {
  const authors = getAuthorsForArticle(article)
  const authorNames = authors.map((a) => a.name).join(', ')

  return (
    <article className="py-5 border-b border-slate-200 group">
      <div className="flex items-start gap-2 text-xs text-ocean-blue font-semibold uppercase tracking-wide mb-1.5">
        <FileText size={14} />
        Research Article
        {issue && <span className="text-slate-400 font-normal normal-case">· Issue {issue.number}</span>}
      </div>
      <h3 className="text-lg font-semibold text-royal-blue leading-snug mb-1.5">
        <Link to={`/articles/${article.slug}`} className="group-hover:text-ocean-blue hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="text-sm text-slate-600 mb-2">{authorNames}</p>
      <p className="text-sm text-slate-500 line-clamp-2">{article.abstract}</p>
    </article>
  )
}
