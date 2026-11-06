import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { journal } from '@/lib/staticContent'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import { getTopics, getEditorialBoard } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import AuthorAvatar from '@/components/AuthorAvatar'
import SideSection from '@/components/SideSection'

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
      <PageBanner title={t.about.title} />

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
        <figcaption className="text-sm text-slate-600 mt-2">
          {t.about.heroCaption}
        </figcaption>
      </figure>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose-block">
            {t.journal.aboutText.split('\n\n').map((para, i) => (
              <p key={i} className="font-display text-slate-800 text-[1.0625rem] leading-[1.7] mb-5">
                {para}
              </p>
            ))}
          </div>

          <h2 className="font-display text-2xl text-royal-blue mt-10 mb-4">
            {t.about.scope}
          </h2>
          <ul className="grid sm:grid-cols-2">
            {t.journal.scopeAreas.map((area, i) => (
              <li key={area} className="py-3 border-b border-slate-200">
                <Link href={`/topics/${topics[i].slug}`} className="text-ocean-blue hover:underline">
                  {area}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="font-display text-2xl text-royal-blue mt-12 mb-6">
            {t.about.standards}
          </h2>
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
            {t.about.trustSignals.map((signal, i) => (
              <div key={signal.title}>
                <dt className="font-semibold text-royal-blue mb-1">{signal.title}</dt>
                <dd className="text-slate-700 leading-relaxed">
                  {signal.body}
                  {/* The third signal is the correction policy — its text says
                      "see our correction policy", so give it the link. */}
                  {i === 2 && (
                    <Link href="/correction-policy" className="block mt-1.5 text-ocean-blue font-medium hover:underline">
                      {t.about.readCorrectionPolicy}
                    </Link>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="space-y-10">
          <SideSection title={t.about.details}>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-600">{t.about.publisher}</dt>
                <dd className="text-slate-900">{journal.publisher}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">{t.about.frequency}</dt>
                <dd className="text-slate-900">{t.journal.frequency}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">{t.about.issn}</dt>
                <dd className="text-slate-900">{journal.issn ?? t.journal.issnPending}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">{t.about.founded}</dt>
                <dd className="text-slate-900">{journal.founded}</dd>
              </div>
            </dl>
          </SideSection>

          <SideSection title={t.about.board}>
            {board.length === 0 ? (
              <p className="text-slate-600">{t.about.noBoard}</p>
            ) : (
              <ul>
                {board.slice(0, 4).map((m) => (
                  <li key={m.id} className="flex gap-3 py-3 border-b border-slate-200">
                    <AuthorAvatar name={m.name} photo={m.photo} size="sm" className="rounded-full" />
                    <div>
                      <p className="font-medium text-slate-900">{m.name}</p>
                      <p className="text-slate-600 text-sm">{m.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/editorial-board" className="inline-block mt-4 text-ocean-blue font-medium hover:underline">
              {t.about.viewFullBoard}
            </Link>
          </SideSection>
        </aside>
      </section>
    </div>
  )
}
