import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import PageBanner from '@/components/PageBanner'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.resetPassword.metaTitle, description: t.resetPassword.metaDescription }
}

export default async function ResetPasswordPage({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)
  return (
    <div>
      <PageBanner eyebrow={t.common.accountEyebrow} title={t.resetPassword.title} description={t.resetPassword.description} />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ResetPasswordForm />
      </section>
    </div>
  )
}
