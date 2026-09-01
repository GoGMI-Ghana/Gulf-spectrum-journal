import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import SignInForm from '@/components/SignInForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Gulf Spectrum Journal account.',
}

// Reads the redirect target from the searchParams prop rather than the
// useSearchParams() hook — keeps SignInForm free of a Suspense boundary
// requirement, and matches the pattern app/search/page.tsx already uses.
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  // Only ever redirect to a relative path on this site — a query param is
  // attacker-controlled input, and an absolute/protocol-relative URL here
  // would be an open redirect.
  const redirectTo = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

  return (
    <div>
      <PageBanner
        eyebrow="Account"
        title="Sign In"
        description="Sign in to bookmark articles, message other members, and access your dashboard."
      />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SignInForm redirectTo={redirectTo} />
      </section>
    </div>
  )
}
