import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import MessagesApp from '@/components/MessagesApp'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Private messages with other Gulf Spectrum Journal members.',
}

export default function Messages() {
  return (
    <div>
      <PageBanner
        eyebrow="Direct Messages"
        title="Messages"
        description="Private conversations between members — only you and the other person can ever see them."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <MessagesApp />
      </section>
    </div>
  )
}
