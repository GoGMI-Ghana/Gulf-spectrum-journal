import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTopics, getTopicBySlug, getArticlesForTopic } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { rich } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import { socialMetadata } from '@/lib/seo'
import ArticleCard from '@/components/ArticleCard'

export async function generateStaticParams() {
  const topics = await getTopics()
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }: LocaleSlugParams): Promise<Metadata> {
  const { locale, slug } = await params
  const topic = await getTopicBySlug(slug)
  if (!topic) return { title: getDictionary(locale).topic.notFound }
  return {
    title: topic.label,
    description: topic.description,
    ...socialMetadata({ title: topic.label, description: topic.description, path: `/topics/${topic.slug}` }),
  }
}

export default async function TopicDetail({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const topic = await getTopicBySlug(slug)
  if (!topic) notFound()

  const articles = await getArticlesForTopic(topic.slug)

  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-sm font-semibold text-gold-ink mb-1">{t.topic.kicker}</p>
          <h1 className="font-display text-royal-blue text-3xl sm:text-4xl leading-tight mb-3">{topic.label}</h1>
          <p className="text-slate-700 max-w-3xl leading-relaxed">{topic.description}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.length === 0 ? (
          <p className="text-slate-600">
            {rich(t.topic.empty, {
              topicsLink: (
                <Link href="/topics" className="text-ocean-blue hover:underline">{t.topic.allTopicsLink}</Link>
              ),
              issuesLink: (
                <Link href="/issues" className="text-ocean-blue hover:underline">{t.topic.allIssuesLink}</Link>
              ),
            })}
          </p>
        ) : (
          <div>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
        <Link href="/topics" className="block mt-8 text-ocean-blue text-sm font-medium hover:underline">
          {t.topic.back}
        </Link>
      </section>
    </div>
  )
}
