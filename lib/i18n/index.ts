// Server-side entry point: pages and layouts under app/[locale]/ call
// getDictionary(locale) with the [locale] route param. Client Components
// get the same dictionary through useI18n() (context/I18nContext.tsx)
// instead of importing this, so only the active language's strings are
// ever sent to the browser (as the provider's prop) rather than all four
// being bundled into client JavaScript.

import en, { type Dictionary } from './dictionaries/en'
import es from './dictionaries/es'
import fr from './dictionaries/fr'
import pt from './dictionaries/pt'
import { defaultLocale, isLocale, type Locale } from './config'

const dictionaries: Record<Locale, Dictionary> = { en, es, fr, pt }

export function getDictionary(locale: string): Dictionary {
  return dictionaries[toLocale(locale)]
}

// Route params are typed as plain strings; proxy.ts only ever rewrites to
// a supported locale, but anything else falls back to the default rather
// than crashing.
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale
}

export type { Dictionary, Locale }
