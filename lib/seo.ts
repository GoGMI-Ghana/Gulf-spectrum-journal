// Link-preview metadata (Open Graph + Twitter card) — what WhatsApp,
// Facebook, LinkedIn, X, Slack etc. show when a page's link is shared.
//
// Next.js does not derive any of this from a page's `title` /
// `description`, and a page that sets `openGraph` replaces the layout's
// whole `openGraph` object rather than merging into it — so each page
// that wants its own preview spreads socialMetadata() into its
// generateMetadata result, and everything else falls back to the
// site-wide default set in app/[locale]/layout.tsx.
import type { Metadata } from 'next'
import { journal } from './staticContent'

export const siteUrl = `https://${journal.domain}`

// The generic branded card (app/api/og/route.tsx).
export const defaultSocialImage = '/api/og'

// Card images are generated at this size (see lib/ogCard.tsx).
const IMAGE_SIZE = { width: 1200, height: 630 }

export function socialMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  type = 'website',
}: {
  title: string
  description: string
  // Site-relative, e.g. "/articles/some-slug". URLs carry no language
  // prefix on this site (see proxy.ts), so there's one address per page.
  // Omitted only for the layout's site-wide default, which every other
  // page inherits — a URL there would claim they all live at one address.
  path?: string
  image?: string
  type?: 'website' | 'article'
}): Pick<Metadata, 'openGraph' | 'twitter' | 'alternates'> {
  // Relative values are resolved against metadataBase (set in the layout).
  const images = [{ url: image, ...(image.startsWith('/api/og') ? IMAGE_SIZE : {}) }]
  return {
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: { title, description, ...(path ? { url: path } : {}), siteName: journal.name, type, images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  }
}
