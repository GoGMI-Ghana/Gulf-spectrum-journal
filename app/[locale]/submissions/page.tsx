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
              {t.submissions.fields.map((f) => (
                <li key={f} className="text-sm text-slate-700 py-2.5 border-b border-slate-200 last:border-0">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading>{t.submissions.workflowHeading}</SectionHeading>
            {/* These are steps in order, so they keep a number — an ordinary one. */}
            <ol className="list-decimal pl-5 space-y-4 marker:text-slate-500 marker:font-semibold">
              {t.submissions.workflow.map((w) => (
                <li key={w.title} className="pl-1">
                  <h3 className="font-semibold text-royal-blue">{w.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{w.body}</p>
                </li>
              ))}
            </ol>
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
