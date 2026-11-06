import type { Metadata } from 'next'
import { journal } from '@/lib/staticContent'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import SideSection from '@/components/SideSection'
import ContactForm from '@/components/ContactForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.contact.metaTitle, description: t.contact.metaDescription }
}

export default async function Contact({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner title={t.contact.title} description={t.contact.description} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <aside className="space-y-10">
          <SideSection title={t.contact.office}>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-600">{t.common.email}</dt>
                <dd className="text-slate-900">
                  <a href={'mailto:' + journal.contactEmail} className="text-ocean-blue hover:underline">
                    {journal.contactEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">{t.contact.address}</dt>
                <dd className="text-slate-900">{t.contact.addressValue}</dd>
              </div>
            </dl>
          </SideSection>

          <SideSection title="GoGMI">
            <p className="text-slate-700 leading-relaxed">{t.contact.gogmiBody}</p>
            <a
              href="https://www.gogmi.org.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-ocean-blue font-medium hover:underline"
            >
              {t.contact.visit}
            </a>
          </SideSection>
        </aside>
      </section>
    </div>
  )
}
