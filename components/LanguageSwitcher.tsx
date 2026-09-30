'use client'

import { Globe } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { LOCALE_COOKIE, localeNames, locales, isLocale } from '@/lib/i18n/config'

// Stores the choice in the cookie proxy.ts reads, then does a full reload
// rather than router.refresh(): the client router has already cached
// other pages' payloads in the old language (from prefetching), and a
// reload is the one way to guarantee none of those get reused.
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n()

  function handleChange(next: string) {
    if (!isLocale(next) || next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    window.location.reload()
  }

  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <Globe size={12} aria-hidden="true" />
      <span className="sr-only">{t.header.language}</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-inherit text-[11px] cursor-pointer focus:outline-none hover:text-gold transition-colors"
      >
        {locales.map((l) => (
          <option key={l} value={l} lang={l} className="text-ink">
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
