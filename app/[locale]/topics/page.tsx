import Link from 'next/link'
import type { Metadata } from 'next'
import { getTopics, getArticlesForTopic } from '@/lib/content'
import { getDictionary, toLocale } from '@/lib/i18n'
import { plural } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.topics.metaTitle, description: t.topics.metaDescription }
}

export default async function Topics({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const topics = await getTopics()
  const counts = await Promise.all(topics.map((topic) => getArticlesForTopic(topic.slug)))

  return (
    <div>
      <PageBanner eyebrow={t.topics.eyebrow} title={t.topics.title} description={t.topics.description} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
          {topics.map((topic, i) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="bg-white p-6 hover:bg-soft-gold/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-royal-blue font-display">{topic.label}</h3>
                <span className="numeral text-xs text-slate-400 shrink-0 ml-3">
                  {plural(locale, t.common.articleCount, counts[i].length)}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
