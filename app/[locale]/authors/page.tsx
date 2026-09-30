import type { Metadata } from 'next'
import { getAuthors } from '@/lib/content'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import AuthorCard from '@/components/AuthorCard'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.authors.metaTitle, description: t.authors.metaDescription }
}

export default async function Authors({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  const authors = await getAuthors()
  return (
    <div>
      <PageBanner eyebrow={t.authors.eyebrow} title={t.authors.title} description={t.authors.description} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
          {authors.map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </section>
    </div>
  )
}
