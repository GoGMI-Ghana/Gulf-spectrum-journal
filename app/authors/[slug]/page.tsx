import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { authors, getAuthorBySlug, getArticlesForAuthor } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'
import Initials from '@/components/Initials'

export async function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author not found' }
  return { title: author.name, description: author.bio }
}

export default async function AuthorDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const articles = await getArticlesForAuthor(author.slug)

  return (
    <div>
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center gap-6">
          <Initials name={author.name} size="lg" />
          <div>
            <h1 className="font-display text-white text-2xl sm:text-3xl mb-1">{author.name}</h1>
            <p className="text-gold text-sm">{author.credentials}</p>
            <p className="text-white/70 text-sm">{author.affiliation}</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
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
            <Link href="/authors" className="block mt-5 text-ocean-blue text-sm font-medium hover:underline">
              ← All authors
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
