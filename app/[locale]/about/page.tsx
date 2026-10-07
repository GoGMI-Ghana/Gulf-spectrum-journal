import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { journal } from '@/lib/staticContent'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import { getTopics, getEditorialBoard } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import Initials from '@/components/Initials'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.about.metaTitle, description: t.about.metaDescription }
}


export default async function About({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const topics = await getTopics()
  const board = await getEditorialBoard()
  return (
    <div>
      <PageBanner eyebrow={t.about.eyebrow} title={t.about.title} />

      <figure className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="relative w-full h-56 sm:h-72">
          <Image
            src="/hero-conference.jpg"
            alt={t.about.heroAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-xs text-slate-500 mt-2">
          {t.about.heroCaption}
        </figcaption>
      </figure>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose-block">
            {t.journal.aboutText.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>

          <h2 className="text-xl font-bold text-royal-blue font-display mt-10 mb-4 pb-2 border-b-2 border-royal-blue">
            {t.about.scope}
          </h2>
          <ul className="grid sm:grid-cols-2">
            {t.journal.scopeAreas.map((area, i) => (
              <li key={area} className="text-sm py-3 border-b border-slate-200">
                <Link href={`/topics/${topics[i].slug}`} className="text-slate-700 hover:text-ocean-blue">
                  {area}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-royal-blue font-display mt-12 mb-6 pb-2 border-b-2 border-royal-blue">
            {t.about.standards}
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
            {t.about.trustSignals.map((signal, i) => (
              <div key={signal.title} className="flex gap-4">
                <span className="numeral text-gold text-3xl font-bold leading-none shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-semibold text-royal-blue mb-1">{signal.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{signal.body}</p>
                  {/* The third signal is the correction policy — its text says
                      "see our correction policy", so give it the link. */}
                  {i === 2 && (
                    <Link href="/correction-policy" className="inline-block mt-1.5 text-sm text-ocean-blue font-medium hover:underline">
                      {t.about.readCorrectionPolicy}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-4">{t.about.details}</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{t.about.publisher}</dt>
                <dd className="text-slate-800 font-medium">{journal.publisher}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.about.frequency}</dt>
                <dd className="text-slate-800 font-medium">{t.journal.frequency}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.about.issn}</dt>
                <dd className="text-slate-800 font-medium">{journal.issn ?? t.journal.issnPending}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.about.founded}</dt>
                <dd className="text-slate-800 font-medium">{journal.founded}</dd>
              </div>
            </dl>
          </div>

          <div className="border-l-4 border-gold bg-royal-blue text-white p-6">
            <h3 className="kicker text-gold mb-4">{t.about.board}</h3>
            {board.length === 0 ? (
              <p className="text-white/60 text-sm">{t.about.noBoard}</p>
            ) : (
              <ul className="space-y-4">
                {board.slice(0, 4).map((m) => (
                  <li key={m.id} className="flex gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <Initials name={m.name} size="sm" className="!bg-gold !text-royal-blue" />
                    <div>
                      <p className="font-medium text-white text-sm">{m.name}</p>
                      <p className="text-white/60 text-xs">{m.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/editorial-board" className="block mt-5 text-gold text-sm font-medium hover:underline">
              {t.about.viewFullBoard}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
