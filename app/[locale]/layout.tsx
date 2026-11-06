import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Source_Serif_4, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AccountProvider } from '@/context/AccountContext'
import { I18nProvider } from '@/context/I18nContext'
import { getDictionary } from '@/lib/i18n'
import { isLocale, locales } from '@/lib/i18n/config'
import { siteUrl, socialMetadata } from '@/lib/seo'

// A serif for titles and article text, as printed journals use; Inter for
// the interface around them (menus, buttons, labels). Both are variable
// fonts, so every weight comes from one file. latin-ext covers authors'
// names such as Bøås and Vreÿ.
const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-family-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-family-inter',
  display: 'swap',
})

// One statically generated copy of every page per language. proxy.ts
// rewrites each request to the right copy based on the visitor's
// language cookie — see lib/i18n/config.ts.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Admin-panel saves refresh the public pages immediately (via
// /api/revalidate — see lib/revalidateContent.ts). This hourly
// regeneration is only the fallback for content changed some other way,
// e.g. directly in Supabase Studio. Applies to every page below this
// layout; a page can still set a shorter interval (analytics uses 300s).
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(locale)
  return {
    // Lets pages give relative URLs for canonical links and preview
    // images; social crawlers need absolute ones.
    metadataBase: new URL(siteUrl),
    title: {
      default: t.meta.siteTitle,
      template: '%s | Gulf Spectrum Journal',
    },
    description: t.meta.siteDescription,
    // Site-wide default link preview, inherited by every page that
    // doesn't set its own (hence no URL — see socialMetadata).
    ...socialMetadata({ title: t.meta.siteTitle, description: t.meta.siteDescription }),
    // Favicon comes from app/icon.png (Next.js file-convention icon) — the
    // real GoGMI logo, no manual `icons` entry needed.
  }
}

// Deliberately doesn't read the signed-in user here: this layout wraps
// every route, and calling cookies() (which any server-side auth check
// requires) anywhere in that tree would force the whole app out of
// static generation — undoing the point of pre-rendering every
// article/issue/topic/author page at build time. AccountProvider reads
// the session client-side instead (same reasoning as the original
// localStorage-only bookmarks it replaced), so account state is a
// client-hydrated island rather than something the server has to compute
// per request. The language, by contrast, comes from the [locale] route
// param — proxy.ts reads the cookie, so this layout never has to.
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} className={`${serif.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <I18nProvider locale={locale} dictionary={getDictionary(locale)}>
          <AccountProvider>
            {/* First thing a keyboard user reaches: skips the header's links. */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-royal-blue focus:px-4 focus:py-3 focus:font-semibold focus:outline-2 focus:outline-royal-blue"
            >
              {getDictionary(locale).header.skipToContent}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </AccountProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
