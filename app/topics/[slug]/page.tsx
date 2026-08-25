import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { topics, getTopicBySlug, getArticlesForTopic } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'

export async function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = await getTopicBySlug(slug)
  if (!topic) return { title: 'Topic not found' }
  return { title: topic.label, description: topic.description }
}

export default async function TopicDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = await getTopicBySlug(slug)
  if (!topic) notFound()

  const articles = await getArticlesForTopic(topic.slug)

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
            <Link href="/topics" className="text-ocean-blue hover:underline">all topics</Link> or{' '}
            <Link href="/issues" className="text-ocean-blue hover:underline">all issues</Link>.
          </p>
        ) : (
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
        <Link href="/topics" className="block mt-8 text-ocean-blue text-sm font-medium hover:underline">
          ← All topics
        </Link>
      </section>
    </div>
  )
}
