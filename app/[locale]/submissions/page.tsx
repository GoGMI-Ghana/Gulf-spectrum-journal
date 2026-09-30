import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import SubmissionForm from '@/components/SubmissionForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.submissions.metaTitle, description: t.submissions.metaDescription }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
      {children}
    </h2>
  )
}

export default async function Submissions({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.submissions.eyebrow}
        title={t.submissions.title}
        description={t.submissions.description}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <SectionHeading>{t.submissions.prepareHeading}</SectionHeading>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {t.submissions.prepareIntro}
            </p>
            <ul>
              {t.submissions.fields.map((f, i) => (
                <li key={f} className="text-sm text-slate-700 py-2.5 border-b border-slate-200 last:border-0 flex gap-3">
                  <span className="numeral text-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading>{t.submissions.workflowHeading}</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {t.submissions.workflow.map((w, i) => (
                <div key={w.title} className="flex gap-4">
                  <span className="numeral text-gold text-3xl font-bold leading-none shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-semibold text-royal-blue mb-1">{w.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{w.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>{t.submissions.coauthorHeading}</SectionHeading>
            <p className="text-slate-600 leading-relaxed">
              {t.submissions.coauthorBody}
            </p>
          </div>

          <div>
            <SectionHeading>{t.submissions.referencingHeading}</SectionHeading>
            <p className="text-slate-600 leading-relaxed">
              {t.submissions.referencingBody}
            </p>
          </div>
        </div>

        <aside>
          <SubmissionForm />
        </aside>
      </section>
    </div>
  )
}
