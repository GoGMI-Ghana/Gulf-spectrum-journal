import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your Gulf Spectrum Journal account password.',
}

export default function ResetPasswordPage() {
  return (
    <div>
      <PageBanner eyebrow="Account" title="Reset Password" description="We'll email you a link to get back in." />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ResetPasswordForm />
      </section>
    </div>
  )
}
