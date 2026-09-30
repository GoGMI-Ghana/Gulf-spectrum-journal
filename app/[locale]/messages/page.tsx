import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import MessagesApp from '@/components/MessagesApp'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.messages.metaTitle, description: t.messages.metaDescription }
}

export default async function Messages({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.messages.eyebrow}
        title={t.messages.title}
        description={t.messages.description}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <MessagesApp />
      </section>
    </div>
  )
}
