import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import ProfileForm from '@/components/ProfileForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.profile.metaTitle, description: t.profile.metaDescription }
}

export default async function Profile({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.common.accountEyebrow}
        title={t.profile.title}
        description={t.profile.description}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ProfileForm />
      </section>
    </div>
  )
}
