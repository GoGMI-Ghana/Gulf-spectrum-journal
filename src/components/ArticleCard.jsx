import { Link } from 'react-router-dom'
import { getAuthorsForArticle, getTopicForArticle } from '../data/content'

export default function ArticleCard({ article, issue }) {
  const authors = getAuthorsForArticle(article)
  const authorNames = authors.map((a) => a.name).join(', ')
  const topic = getTopicForArticle(article)

  return (
    <article className="py-6 border-b border-slate-200 group">
      <p className="kicker text-ocean-blue mb-2 flex flex-wrap items-center gap-x-2">
        <span>
          Research Article
          {issue && <span className="text-slate-400 font-normal normal-case tracking-normal"> — Issue {issue.number}</span>}
        </span>
        {topic && (
          <Link
            to={`/topics/${topic.slug}`}
            className="text-royal-blue bg-soft-gold px-2 py-0.5 font-normal normal-case tracking-normal hover:bg-gold hover:text-ink transition-colors"
          >
            {topic.label}
          </Link>
        )}
      </p>
      <h3 className="text-lg font-semibold text-royal-blue leading-snug mb-1.5 font-display">
        <Link to={`/articles/${article.slug}`} className="group-hover:text-ocean-blue">
          {article.title}
        </Link>
      </h3>
      <p className="text-sm text-slate-600 mb-2 italic">{authorNames}</p>
      <p className="text-sm text-slate-500 line-clamp-2">{article.abstract}</p>
    </article>
  )
}
