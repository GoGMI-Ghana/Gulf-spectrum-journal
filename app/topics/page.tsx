import Link from 'next/link'
import type { Metadata } from 'next'
import { topics, getArticlesForTopic } from '@/lib/content'
import PageBanner from '@/components/PageBanner'

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse Gulf Spectrum Journal by topic — maritime security, blue economy, governance, capacity building, and more.',
}

export default async function Topics() {
  const counts = await Promise.all(topics.map((t) => getArticlesForTopic(t.slug)))

  return (
    <div>
      <PageBanner
        eyebrow="Browse by Subject"
        title="Topics"
        description="Gulf Spectrum Journal covers the full scope of GoGMI's work, not maritime security alone. Browse articles by topic below."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
          {topics.map((topic, i) => {
            const count = counts[i].length
            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="bg-white p-6 hover:bg-soft-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-royal-blue font-display">{topic.label}</h3>
                  <span className="numeral text-xs text-slate-400 shrink-0 ml-3">
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
