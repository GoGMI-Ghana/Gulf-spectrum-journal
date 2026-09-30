import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import ContactForm from '@/components/ContactForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.contact.metaTitle, description: t.contact.metaDescription }
}

export default async function Contact({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <aside className="space-y-8">
          <div className="border-l-4 border-royal-blue p-6">
            <h3 className="kicker text-royal-blue mb-4">{t.contact.office}</h3>
            <dl className="space-y-3 text-sm text-slate-600">
              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">{t.common.email}</dt>
                <dd>journal@gogmi.org.gh</dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">{t.contact.address}</dt>
                <dd>{t.contact.addressValue}</dd>
              </div>
            </dl>
          </div>

          <div className="border-l-4 border-gold bg-royal-blue text-white p-6">
            <h3 className="kicker text-gold mb-3">GoGMI</h3>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              {t.contact.gogmiBody}
            </p>
            <a
              href="https://www.gogmi.org.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm font-medium hover:underline"
            >
              {t.contact.visit}
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
