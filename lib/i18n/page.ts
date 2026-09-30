// Shared prop type for pages and generateMetadata under app/[locale]/.
// `locale` is a plain string at the type level (it's a route param); pass
// it to getDictionary(), which validates it.
export interface LocaleParams {
  params: Promise<{ locale: string }>
}

export interface LocaleSlugParams {
  params: Promise<{ locale: string; slug: string }>
}
