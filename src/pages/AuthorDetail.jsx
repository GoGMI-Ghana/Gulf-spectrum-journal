import { Link, useParams, Navigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { getAuthorBySlug, getArticlesForAuthor } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import ArticleCard from '../components/ArticleCard'

export default function AuthorDetail() {
  const { authorSlug } = useParams()
  const author = getAuthorBySlug(authorSlug)

  usePageMeta(author?.name, author?.bio)

  if (!author) return <Navigate to="/authors" replace />

  const articles = getArticlesForAuthor(author.slug)

  return (
    <div>
      <section className="bg-royal-blue border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-soft-gold flex items-center justify-center border-2 border-gold shrink-0">
            <UserRound className="text-royal-blue" size={38} />
          </div>
          <div>
            <h1 className="font-serif-display text-white text-2xl sm:text-3xl mb-1">{author.name}</h1>
            <p className="text-gold text-sm">{author.credentials}</p>
            <p className="text-white/70 text-sm">{author.affiliation}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-royal-blue mb-4">Articles</h2>
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        <aside>
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-3">Biography</h3>
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
