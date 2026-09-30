import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAuthorBySlug } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import { fmt } from '@/lib/i18n/format'
import type { LocaleSlugParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import ClaimAuthorForm from '@/components/ClaimAuthorForm'

export async function generateMetadata({ params }: LocaleSlugParams): Promise<Metadata> {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const author = await getAuthorBySlug(slug)
  return { title: author ? fmt(t.claim.metaTitle, { name: author.name }) : t.claim.metaFallback }
}

export default async function ClaimAuthorPage({ params }: LocaleSlugParams) {
  const { locale, slug } = await params
  const t = getDictionary(locale)
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  return (
    <div>
      <PageBanner eyebrow={t.claim.eyebrow} title={fmt(t.claim.title, { name: author.name })} description={t.claim.description} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ClaimAuthorForm authorId={author.id} authorSlug={author.slug} authorName={author.name} claimed={author.claimed} />
      </section>
    </div>
  )
}
