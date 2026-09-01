import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import AccountSettingsForm from '@/components/AccountSettingsForm'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your password, sessions, and account.',
}

export default function AccountSettings() {
  return (
    <div>
      <PageBanner eyebrow="Account" title="Account Settings" description="Password, sessions, and account deletion." />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <AccountSettingsForm />
      </section>
    </div>
  )
}
