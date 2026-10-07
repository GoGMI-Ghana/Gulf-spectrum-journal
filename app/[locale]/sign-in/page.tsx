import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import PageBanner from '@/components/PageBanner'
import SignInForm from '@/components/SignInForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.signIn.metaTitle, description: t.signIn.metaDescription }
}

// Reads the redirect target from the searchParams prop rather than the
// useSearchParams() hook — keeps SignInForm free of a Suspense boundary
// requirement, and matches the pattern app/search/page.tsx already uses.
export default async function SignIn({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const t = getDictionary((await params).locale)
  const { redirect, error } = await searchParams
  // Only ever redirect to a relative path on this site — a query param is
  // attacker-controlled input, and an absolute/protocol-relative URL here
  // would be an open redirect.
  const redirectTo = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

  return (
    <div>
      <PageBanner eyebrow={t.common.accountEyebrow} title={t.signIn.title} description={t.signIn.description} />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* app/auth/callback sends people back here with ?error=oauth
            when a Google sign-in couldn't be completed. */}
        {error === 'oauth' && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mb-6">{t.signIn.oauthFailed}</p>
        )}
        <SignInForm redirectTo={redirectTo} />
      </section>
    </div>
  )
}
