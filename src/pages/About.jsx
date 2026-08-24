import { Target, Users, ShieldCheck, RefreshCcw } from 'lucide-react'
import { journal } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Editorial Review',
    body: "Every volume is reviewed by a dedicated editorial board before publication. Reviewers set that volume's citation style and word-count guidance.",
  },
  {
    icon: Users,
    title: 'Named Authorship',
    body: 'Every article displays each author’s name, photograph, and institutional affiliation, alongside a full formatted reference list.',
  },
  {
    icon: RefreshCcw,
    title: 'Correction Policy',
    body: 'Corrections to published articles are marked and dated on the article itself. See our correction policy for details.',
  },
  {
    icon: Target,
    title: 'Disclosure',
    body: 'Articles include a funding or conflict-of-interest disclosure line where applicable.',
  },
]

export default function About() {
  usePageMeta('About the Journal', "The Gulf Spectrum's ongoing mission: locally produced research on maritime security and governance in the Gulf of Guinea, reviewed by a dedicated editorial board.")

  return (
    <div>
      <PageBanner eyebrow="About" title="About the Journal" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose-block">
            {journal.aboutText.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>

          <h2 className="text-xl font-bold text-royal-blue mt-10 mb-4">Scope</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {journal.scopeAreas.map((area) => (
              <li key={area} className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-md p-3 text-sm text-slate-700">
                <span className="text-gold mt-0.5">▸</span> {area}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-royal-blue mt-10 mb-4">Content Standards & Trust Signals</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {trustSignals.map((t) => (
              <div key={t.title} className="border border-slate-200 rounded-lg p-5">
                <t.icon className="text-ocean-blue mb-2" size={22} />
                <h3 className="font-semibold text-royal-blue mb-1">{t.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-4">Journal Details</h3>
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

          <div className="bg-royal-blue text-white rounded-lg p-6">
            <h3 className="font-semibold text-gold text-sm uppercase tracking-wide mb-3">Editorial Board</h3>
            <ul className="space-y-4">
              {journal.editorialBoard.map((m) => (
                <li key={m.name}>
                  <p className="font-medium text-white text-sm">{m.name}</p>
                  <p className="text-white/70 text-xs">{m.role}</p>
                  <p className="text-white/60 text-xs">{m.affiliation}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
