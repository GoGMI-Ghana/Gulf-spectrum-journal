import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import ToolsGrid from '@/components/ToolsGrid'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.tools.metaTitle, description: t.tools.metaDescription }
}

export default async function Tools({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner eyebrow={t.tools.title} title={t.tools.title} description={t.tools.description} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ToolsGrid />
      </section>
    </div>
  )
}
