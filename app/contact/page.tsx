import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the editorial office of Gulf Spectrum Journal, a publication of the Gulf of Guinea Maritime Institute.',
}

export default function Contact() {
  return (
    <div>
      <PageBanner eyebrow="Get in Touch" title="Contact" description="Questions about submissions, past issues, or partnership with Gulf Spectrum Journal." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
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
