import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAuthorBySlug } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import ClaimAuthorForm from '@/components/ClaimAuthorForm'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  return { title: author ? `Claim ${author.name}` : 'Claim Author Profile' }
}

export default async function ClaimAuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  return (
    <div>
      <PageBanner eyebrow="Authors" title={`Claim ${author.name}`} description="Link this author profile to your account." />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ClaimAuthorForm authorId={author.id} authorSlug={author.slug} authorName={author.name} claimed={author.claimed} />
      </section>
    </div>
  )
}
