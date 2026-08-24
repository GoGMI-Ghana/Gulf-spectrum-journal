import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'

export default function Contact() {
  usePageMeta('Contact', 'Contact the editorial office of Gulf Spectrum Journal, a publication of the Gulf of Guinea Maritime Institute.')

  return (
    <div>
      <PageBanner eyebrow="Get in Touch" title="Contact" description="Questions about submissions, past issues, or partnership with Gulf Spectrum Journal." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form
            className="space-y-5"
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
                  className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
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
                  className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
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
                className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
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
                className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-royal-blue"
              />
            </div>
            <button
              type="submit"
              className="bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold text-sm px-6 py-2.5 transition-colors tracking-wide"
            >
              Send Message
            </button>
          </form>
          <p className="hidden mt-4 text-sm text-royal-blue bg-soft-gold/60 border-l-4 border-gold p-3">
            Thank you — this is a design prototype, so no message was sent. Once
            connected, the editorial office will respond directly.
          </p>
        </div>

        <aside className="space-y-8">
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-4">Editorial Office</h3>
            <dl className="space-y-3 text-sm text-slate-600">
              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">Email</dt>
                <dd>journal@gogmi.org.gh</dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">Address</dt>
                <dd>Gulf of Guinea Maritime Institute, Accra, Ghana</dd>
              </div>
            </dl>
          </div>

          <div className="border-l-4 border-gold bg-royal-blue text-white p-6">
            <h3 className="kicker text-gold mb-3">GoGMI</h3>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              Gulf Spectrum Journal is published by the Gulf of Guinea Maritime
              Institute, a non-profit maritime think tank operating across the
              region.
            </p>
            <a
              href="https://www.gogmi.org.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm font-medium hover:underline"
            >
              Visit gogmi.org.gh →
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
