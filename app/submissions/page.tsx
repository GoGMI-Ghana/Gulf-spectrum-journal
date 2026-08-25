import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import SubmissionForm from '@/components/SubmissionForm'

export const metadata: Metadata = {
  title: 'Submission Guidelines',
  description: 'Guidance for prospective authors and co-authors submitting research to Gulf Spectrum Journal.',
}

const structuredFields = [
  'Title',
  'Author(s) / co-author(s), each with a photo and institutional affiliation',
  'Abstract',
  'Keywords',
  'Body content with headed sections',
  'Conclusion',
  'A formatted list of references',
]

const workflow = [
  { step: '01', title: 'Submit', body: 'Send your manuscript and author details through the submission form below.' },
  { step: '02', title: 'Editorial Review', body: "That issue's editorial board reviews the submission for quality and rigor." },
  { step: '03', title: 'Revisions', body: 'Authors address reviewer feedback as needed before the article is finalized.' },
  { step: '04', title: 'Published', body: 'The article is published as part of its themed issue, with full author credit.' },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-royal-blue font-display mb-4 pb-2 border-b-2 border-royal-blue">
      {children}
    </h2>
  )
}

export default function Submissions() {
  return (
    <div>
      <PageBanner
        eyebrow="For Authors"
        title="Submission Guidelines"
        description="Gulf Spectrum Journal welcomes original research from naval and coast guard officers, academics, legal practitioners, and other subject-matter experts working on Gulf of Guinea maritime affairs."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <SectionHeading>What to Prepare</SectionHeading>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Each article requires the following structured fields. Citation style
              and word-count guidance are set by that issue&apos;s editorial board and
              will be confirmed with you at submission.
            </p>
            <ul>
              {structuredFields.map((f, i) => (
                <li key={f} className="text-sm text-slate-700 py-2.5 border-b border-slate-200 last:border-0 flex gap-3">
                  <span className="numeral text-gold font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading>Editorial Workflow</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {workflow.map((w) => (
                <div key={w.step} className="flex gap-4">
                  <span className="numeral text-gold text-3xl font-bold leading-none shrink-0">{w.step}</span>
                  <div>
                    <h3 className="font-semibold text-royal-blue mb-1">{w.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{w.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Co-Authorship</SectionHeading>
            <p className="text-slate-600 leading-relaxed">
              Articles with multiple contributors are welcome and common in this
              journal. Please provide a name, photograph, and institutional
              affiliation for every co-author at submission.
            </p>
          </div>

          <div>
            <SectionHeading>Referencing</SectionHeading>
            <p className="text-slate-600 leading-relaxed">
              Reference style is set per issue by that issue&apos;s editorial board.
              Submit your reference list in the format used by your discipline;
              the editorial board will confirm the final house style during review.
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
