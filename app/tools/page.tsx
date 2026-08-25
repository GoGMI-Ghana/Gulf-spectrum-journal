import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import ToolsGrid from '@/components/ToolsGrid'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Search, citations, bookmarks, and other tools for working with Gulf Spectrum Journal.',
}

export default function Tools() {
  return (
    <div>
      <PageBanner eyebrow="Tools" title="Tools" description="Everything for working with Gulf Spectrum Journal in one place." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ToolsGrid />
      </section>
    </div>
  )
}
