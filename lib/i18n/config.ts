// The site's supported interface languages. Only the UI chrome is
// translated (nav, headings, forms, messages) — journal content itself
// (article titles, abstracts, bodies, author bios, topic names) comes from
// the database and is shown in whatever language it was published in.
//
// The chosen language lives in a cookie rather than in the URL: proxy.ts
// reads it and internally rewrites /about to /fr/about, so every existing
// link, redirect and bookmarked URL keeps working unchanged, while each
// language still gets its own statically generated copy of every page
// under app/[locale]/. Visiting /fr (or /fr/anything) directly sets the
// cookie and redirects to the unprefixed URL — handy for sharing a link
// that opens in a given language.

export const locales = ['en', 'es', 'fr', 'pt'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

// Each language's name written in that language, for the switcher.
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
}

// Tags passed to Intl / toLocaleDateString. en-US matches the date format
// the site already used before translation existed.
export const intlLocales: Record<Locale, string> = {
  en: 'en-US',
  es: 'es',
  fr: 'fr',
  pt: 'pt',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return (locales as readonly string[]).includes(value ?? '')
}
