import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import { rich } from '@/lib/i18n/format'
import type { LocaleParams } from '@/lib/i18n/page'
import { journal } from '@/lib/staticContent'
import PageBanner from '@/components/PageBanner'

// The policy the About page's "Correction Policy" trust signal refers to,
// and that an article's correction notice links to. The wording lives in
// the dictionaries (lib/i18n/dictionaries, under `correctionPolicy`) so it
// can be revised there in each language without touching this page.

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.correctionPolicy.metaTitle, description: t.correctionPolicy.metaDescription }
}

export default async function CorrectionPolicy({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const email = (
    <a href={`mailto:${journal.contactEmail}`} className="text-ocean-blue hover:underline">
      {journal.contactEmail}
    </a>
  )

  return (
    <div>
      <PageBanner eyebrow={t.correctionPolicy.eyebrow} title={t.correctionPolicy.title} description={t.correctionPolicy.description} />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {t.correctionPolicy.sections.map((section) => (
          <div key={section.heading} className="mb-9">
            <h2 className="text-xl font-bold text-royal-blue font-display mb-3 pb-2 border-b-2 border-royal-blue">{section.heading}</h2>
            <p className="text-slate-700 leading-relaxed">{rich(section.body, { email })}</p>
          </div>
        ))}
        <Link href="/contact" className="text-ocean-blue text-sm font-medium hover:underline">
          {t.footer.contactOffice} →
        </Link>
      </section>
    </div>
  )
}
