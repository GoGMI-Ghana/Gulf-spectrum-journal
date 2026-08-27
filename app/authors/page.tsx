import type { Metadata } from 'next'
import { getAuthors } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import AuthorCard from '@/components/AuthorCard'

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the naval officers, researchers, and legal practitioners contributing to Gulf Spectrum Journal.',
}

export default async function Authors() {
  const authors = await getAuthors()
  return (
    <div>
      <PageBanner
        eyebrow="Contributors"
        title="Authors"
        description="Gulf Spectrum Journal's contributors are naval and coast guard officers, university researchers, legal practitioners, and other subject-matter experts from Ghana and partner countries."
      />
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
