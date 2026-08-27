import { getAuthorsForArticle, getTopicForArticle } from '@/lib/content'
import type { Article, Issue } from '@/lib/types'
import { ArticleCardView } from './ArticleCardView'

// Async Server Component wrapper — resolves an article's authors/topic and
// renders the view. Use this from Server Components; import
// ArticleCardView directly when data is already resolved (e.g. client-side
// lists) — this file imports lib/content, which is server-only.
export default async function ArticleCard({ article, issue }: { article: Article; issue?: Issue }) {
  const authors = await getAuthorsForArticle(article)
  const topic = await getTopicForArticle(article)

  return <ArticleCardView article={article} authors={authors} topic={topic} issue={issue} />
}
