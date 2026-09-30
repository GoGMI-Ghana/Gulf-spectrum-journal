import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import NotificationsList from '@/components/NotificationsList'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.notifications.metaTitle, description: t.notifications.metaDescription }
}

export default async function Notifications({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.notifications.eyebrow}
        title={t.notifications.title}
        description={t.notifications.description}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <NotificationsList />
      </section>
    </div>
  )
}
