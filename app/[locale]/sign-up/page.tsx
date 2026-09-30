import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import SignUpForm from '@/components/SignUpForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.signUp.metaTitle, description: t.signUp.metaDescription }
}

export default async function SignUp({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner
        eyebrow={t.common.accountEyebrow}
        title={t.signUp.title}
        description={t.signUp.description}
      />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SignUpForm />
      </section>
    </div>
  )
}
