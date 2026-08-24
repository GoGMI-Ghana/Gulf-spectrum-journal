import { Mail, MapPin, ExternalLink } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

export default function Contact() {
  usePageMeta('Contact', 'Contact the editorial office of The Gulf Spectrum, the GoGMI Journal of Maritime Research.')

  return (
    <div>
      <PageBanner eyebrow="Get in Touch" title="Contact" description="Questions about submissions, past issues, or partnership with The Gulf Spectrum." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form
            className="space-y-5 border border-slate-200 rounded-lg p-6"
            onSubmit={(e) => {
              e.preventDefault()
              e.currentTarget.reset()
              const note = e.currentTarget.nextElementSibling
              if (note) note.classList.remove('hidden')
            }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-name">
                  Name
                </label>
                <input
                  id="c-name"
                  required
                  type="text"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-email">
                  Email
                </label>
                <input
                  id="c-email"
                  required
                  type="email"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-subject">
                Subject
              </label>
              <input
                id="c-subject"
                required
                type="text"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="c-message">
                Message
              </label>
              <textarea
                id="c-message"
                required
                rows={6}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 rounded transition-colors"
            >
              Send Message
            </button>
          </form>
          <p className="hidden mt-4 text-sm text-ocean-blue bg-soft-gold/60 border border-gold/40 rounded p-3">
            Thank you — this is a design prototype, so no message was sent. Once
            connected, the editorial office will respond directly.
          </p>
        </div>

        <aside className="space-y-5">
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-royal-blue text-sm uppercase tracking-wide mb-4">Editorial Office</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-ocean-blue" /> journal@gogmi.org.gh
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-ocean-blue mt-0.5" /> Gulf of Guinea Maritime Institute, Accra, Ghana
              </p>
            </div>
          </div>

          <div className="bg-royal-blue text-white rounded-lg p-6">
            <h3 className="font-semibold text-gold text-sm uppercase tracking-wide mb-3">GoGMI</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              The Gulf Spectrum is published by the Gulf of Guinea Maritime
              Institute, a non-profit maritime think tank operating across the
              region.
            </p>
            <a
              href="https://www.gogmi.org.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gold text-sm font-medium hover:underline"
            >
              Visit gogmi.org.gh <ExternalLink size={14} />
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
