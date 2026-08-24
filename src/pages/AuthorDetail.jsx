import { Link, useParams, Navigate } from 'react-router-dom'
import { getAuthorBySlug, getArticlesForAuthor } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import ArticleCard from '../components/ArticleCard'
import Initials from '../components/Initials'

export default function AuthorDetail() {
  const { authorSlug } = useParams()
  const author = getAuthorBySlug(authorSlug)

  usePageMeta(author?.name, author?.bio)

  if (!author) return <Navigate to="/authors" replace />

  const articles = getArticlesForAuthor(author.slug)

  return (
    <div>
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center gap-6">
          <Initials name={author.name} size="lg" />
          <div>
            <h1 className="font-serif-display text-white text-2xl sm:text-3xl mb-1">{author.name}</h1>
            <p className="text-gold text-sm">{author.credentials}</p>
            <p className="text-white/70 text-sm">{author.affiliation}</p>
          </div>
        </div>
        <div className="double-rule" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-royal-blue font-serif-display mb-4 pb-2 border-b-2 border-royal-blue">
            Articles
          </h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-3">Biography</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{author.bio}</p>
            <Link to="/authors" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              ← All authors
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
