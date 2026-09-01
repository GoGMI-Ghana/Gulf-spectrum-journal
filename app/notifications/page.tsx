import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import NotificationsList from '@/components/NotificationsList'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Updates on new issues and articles from Gulf Spectrum Journal.',
}

export default function Notifications() {
  return (
    <div>
      <PageBanner
        eyebrow="Updates"
        title="Notifications"
        description="New issues, and new articles in topics you've bookmarked from. Generated automatically when the journal actually publishes something — not a general inbox."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <NotificationsList />
      </section>
    </div>
  )
}
