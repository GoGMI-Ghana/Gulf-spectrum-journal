import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import SignUpForm from '@/components/SignUpForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a free Gulf Spectrum Journal account to bookmark articles and access your dashboard.',
}

export default function SignUp() {
  return (
    <div>
      <PageBanner
        eyebrow="Account"
        title="Create Account"
        description="Free — lets you bookmark articles and access your dashboard. This is separate from GoGMI Membership, which supports the journal directly."
      />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SignUpForm />
      </section>
    </div>
  )
}
