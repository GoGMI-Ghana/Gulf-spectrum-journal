import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import EditorialBoardApplicationForm from '@/components/EditorialBoardApplicationForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.boardApply.metaTitle, description: t.boardApply.metaDescription }
}

export default async function ApplyEditorialBoardPage({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.boardApply.eyebrow}
        title={t.boardApply.title}
        description={t.boardApply.description}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <EditorialBoardApplicationForm />
      </section>
    </div>
  )
}
