import { FileText, Users, ListChecks, Quote, CheckCircle2 } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

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
  { step: '1', title: 'Submit', body: 'Send your manuscript and author details through the submission form below.' },
  { step: '2', title: 'Editorial Review', body: "That issue's editorial board reviews the submission for quality and rigor." },
  { step: '3', title: 'Revisions', body: 'Authors address reviewer feedback as needed before the article is finalized.' },
  { step: '4', title: 'Published', body: 'The article is published as part of its themed issue, with full author credit.' },
]

export default function Submissions() {
  usePageMeta('Submission Guidelines', 'Guidance for prospective authors and co-authors submitting research to The Gulf Spectrum.')

  return (
    <div>
      <PageBanner
        eyebrow="For Authors"
        title="Submission Guidelines"
        description="The Gulf Spectrum welcomes original research from naval and coast guard officers, academics, legal practitioners, and other subject-matter experts working on Gulf of Guinea maritime affairs."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-royal-blue mb-4">
              <FileText size={20} /> What to Prepare
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Each article requires the following structured fields. Citation style
              and word-count guidance are set by that issue's editorial board and
              will be confirmed with you at submission.
            </p>
            <ul className="space-y-2">
              {structuredFields.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-ocean-blue mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-royal-blue mb-4">
              <ListChecks size={20} /> Editorial Workflow
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {workflow.map((w) => (
                <div key={w.step} className="border border-slate-200 rounded-lg p-5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-royal-blue text-gold text-xs font-bold mb-3">
                    {w.step}
                  </span>
                  <h3 className="font-semibold text-royal-blue mb-1">{w.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-royal-blue mb-4">
              <Users size={20} /> Co-Authorship
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Articles with multiple contributors are welcome and common in this
              journal. Please provide a name, photograph, and institutional
              affiliation for every co-author at submission.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-royal-blue mb-4">
              <Quote size={20} /> Referencing
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Reference style is set per issue by that issue's editorial board.
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

function SubmissionForm() {
  return (
    <div className="border border-slate-200 rounded-lg p-6 sticky top-32 bg-white">
      <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-4">
        Start Your Submission
      </h3>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.currentTarget.reset()
          const note = e.currentTarget.nextElementSibling
          if (note) note.classList.remove('hidden')
        }}
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-name">
            Full name
          </label>
          <input
            id="sub-name"
            required
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-email">
            Email
          </label>
          <input
            id="sub-email"
            required
            type="email"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-title">
            Proposed article title
          </label>
          <input
            id="sub-title"
            required
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sub-abstract">
            Abstract (draft)
          </label>
          <textarea
            id="sub-abstract"
            rows={4}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-4 py-2.5 rounded transition-colors"
        >
          Submit for Review
        </button>
      </form>
      <p className="hidden mt-4 text-sm text-ocean-blue bg-soft-gold/60 border border-gold/40 rounded p-3">
        Thank you — this is a design prototype, so no submission was sent. The
        editorial office will follow up once the form is connected.
      </p>
    </div>
  )
}
