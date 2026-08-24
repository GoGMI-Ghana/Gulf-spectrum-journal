import { journal } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'
import Initials from '../components/Initials'

const trustSignals = [
  {
    n: '01',
    title: 'Editorial Review',
    body: "Every volume is reviewed by a dedicated editorial board before publication. Reviewers set that volume's citation style and word-count guidance.",
  },
  {
    n: '02',
    title: 'Named Authorship',
    body: 'Every article displays each author’s name, photograph, and institutional affiliation, alongside a full formatted reference list.',
  },
  {
    n: '03',
    title: 'Correction Policy',
    body: 'Corrections to published articles are marked and dated on the article itself. See our correction policy for details.',
  },
  {
    n: '04',
    title: 'Disclosure',
    body: 'Articles include a funding or conflict-of-interest disclosure line where applicable.',
  },
]

export default function About() {
  usePageMeta('About the Journal', "The Gulf Spectrum's ongoing mission: locally produced research on maritime security and governance in the Gulf of Guinea, reviewed by a dedicated editorial board.")

  return (
    <div>
      <PageBanner eyebrow="About" title="About the Journal" />

      <figure className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <img
          src="/hero-conference.jpg"
          alt="Naval officers, researchers, and policymakers at GoGMI's Maritime Security Conference 2025 in Accra"
          className="w-full h-56 sm:h-72 object-cover"
        />
        <figcaption className="text-xs text-slate-500 mt-2">
          GoGMI's Maritime Security Conference 2025, Accra — the network of contributors this journal draws on.
        </figcaption>
      </figure>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose-block">
            {journal.aboutText.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>

          <h2 className="text-xl font-bold text-royal-blue font-serif-display mt-10 mb-4 pb-2 border-b-2 border-royal-blue">
            Scope
          </h2>
          <ul className="grid sm:grid-cols-2">
            {journal.scopeAreas.map((area) => (
              <li key={area} className="text-sm text-slate-700 py-3 border-b border-slate-200">
                {area}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-royal-blue font-serif-display mt-12 mb-6 pb-2 border-b-2 border-royal-blue">
            Content Standards &amp; Trust Signals
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
            {trustSignals.map((t) => (
              <div key={t.title} className="flex gap-4">
                <span className="numeral text-gold text-3xl font-bold leading-none shrink-0">{t.n}</span>
                <div>
                  <h3 className="font-semibold text-royal-blue mb-1">{t.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-4">Journal Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Publisher</dt>
                <dd className="text-slate-800 font-medium">{journal.publisher}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Frequency</dt>
                <dd className="text-slate-800 font-medium">{journal.frequency}</dd>
              </div>
              <div>
                <dt className="text-slate-500">ISSN</dt>
                <dd className="text-slate-800 font-medium">{journal.issn}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Founded</dt>
                <dd className="text-slate-800 font-medium">{journal.founded}</dd>
              </div>
            </dl>
          </div>

          <div className="border-l-4 border-gold bg-royal-blue text-white p-6">
            <h3 className="kicker text-gold mb-4">Editorial Board</h3>
            <ul className="space-y-4">
              {journal.editorialBoard.map((m) => (
                <li key={m.name} className="flex gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                  <Initials name={m.name} size="sm" className="!bg-gold !text-royal-blue" />
                  <div>
                    <p className="font-medium text-white text-sm">{m.name}</p>
                    <p className="text-white/60 text-xs">{m.role}</p>
                    <p className="text-white/50 text-xs">{m.affiliation}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
