import { authors } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import PageBanner from '../components/PageBanner'
import AuthorCard from '../components/AuthorCard'

export default function Authors() {
  usePageMeta('Authors', 'Meet the naval officers, researchers, and legal practitioners contributing to The Gulf Spectrum.')

  return (
    <div>
      <PageBanner
        eyebrow="Contributors"
        title="Authors"
        description="The Gulf Spectrum's contributors are naval and coast guard officers, university researchers, legal practitioners, and other subject-matter experts from Ghana and partner countries."
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </section>
    </div>
  )
}
