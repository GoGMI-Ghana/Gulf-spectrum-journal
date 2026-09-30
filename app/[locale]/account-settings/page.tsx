import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import AccountSettingsForm from '@/components/AccountSettingsForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.accountSettings.metaTitle, description: t.accountSettings.metaDescription }
}

export default async function AccountSettings({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner eyebrow={t.common.accountEyebrow} title={t.accountSettings.title} description={t.accountSettings.description} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <AccountSettingsForm />
      </section>
    </div>
  )
}
