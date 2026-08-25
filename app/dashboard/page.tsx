import Link from 'next/link'
import type { Metadata } from 'next'
import { articles, getIssueForArticle } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'
import DashboardSidebar from '@/components/DashboardSidebar'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Gulf Spectrum Journal dashboard.',
}

export default async function Dashboard() {
  const issuesForArticles = await Promise.all(articles.map((a) => getIssueForArticle(a)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      <DashboardSidebar />

      <div>
        <Link
          href="/submissions"
          className="block border border-slate-300 hover:border-royal-blue px-4 py-3 text-sm text-slate-500 mb-8 transition-colors"
        >
          Share your research with other Gulf of Guinea maritime professionals →
        </Link>

        <h2 className="text-lg font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
          Recent Articles
        </h2>
        <div>
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} issue={issuesForArticles[i]} />
          ))}
        </div>
      </div>
    </div>
  )
}
