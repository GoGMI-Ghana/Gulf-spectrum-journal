'use client'

// A Client Component so it can read the language from I18nContext:
// not-found.js doesn't receive route params, so this is the only way to
// know which language the surrounding [locale] layout is rendering in.
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/context/I18nContext'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Image src="/gogmi-logo.png" alt="" width={64} height={64} className="mx-auto h-16 w-16 object-contain mb-6 opacity-80" />
      <p className="kicker text-ocean-blue mb-2">404</p>
      <h1 className="text-3xl font-bold text-royal-blue font-display mb-3">{t.notFound.title}</h1>
      <p className="text-slate-600 mb-8">{t.notFound.body}</p>
      <Link href="/" className="inline-block bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold px-6 py-3 transition-colors tracking-wide">
        {t.notFound.home}
      </Link>
    </div>
  )
}
