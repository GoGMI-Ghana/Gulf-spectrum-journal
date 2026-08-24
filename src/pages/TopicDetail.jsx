import { Link, useParams, Navigate } from 'react-router-dom'
import { getTopicBySlug, getArticlesForTopic } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import ArticleCard from '../components/ArticleCard'

export default function TopicDetail() {
  const { topicSlug } = useParams()
  const topic = getTopicBySlug(topicSlug)

  usePageMeta(topic ? topic.label : 'Topic not found', topic?.description)

  if (!topic) return <Navigate to="/topics" replace />

  const articles = getArticlesForTopic(topic.slug)

  return (
    <div>
      <section className="bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="kicker text-gold mb-2">Topic</p>
          <h1 className="font-display text-white text-3xl sm:text-4xl mb-4">{topic.label}</h1>
          <p className="text-white/75 max-w-3xl leading-relaxed">{topic.description}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.length === 0 ? (
          <p className="text-slate-600">
            No articles published under this topic yet. Browse{' '}
            <Link to="/topics" className="text-ocean-blue hover:underline">all topics</Link> or{' '}
            <Link to="/issues" className="text-ocean-blue hover:underline">all issues</Link>.
          </p>
        ) : (
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
        <Link to="/topics" className="block mt-8 text-ocean-blue text-sm font-medium hover:underline">
          ← All topics
        </Link>
      </section>
    </div>
  )
}
