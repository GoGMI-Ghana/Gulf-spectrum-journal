import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import ProfileForm from '@/components/ProfileForm'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Gulf Spectrum Journal account.',
}

export default function Profile() {
  return (
    <div>
      <PageBanner
        eyebrow="Account"
        title="My Profile"
        description="Your name and account details."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ProfileForm />
      </section>
    </div>
  )
}
