'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import type { Locale } from '@/lib/i18n/config'

interface I18nContextValue {
  locale: Locale
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

// Provided once by app/[locale]/layout.tsx with the dictionary for the
// language this copy of the page was generated in, so every Client
// Component below can read translated strings without prop-drilling.
export function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dictionary }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider')
  return ctx
}
