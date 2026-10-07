// /robots.txt — points crawlers at the sitemap and keeps them out of the
// pages that are only meaningful to a signed-in person. (This is a request
// to well-behaved crawlers, not access control: those pages are protected
// by sign-in and database rules, not by this file.) /api is deliberately
// not listed: the link-preview images and article PDFs live there, and
// social networks and search engines need to fetch them.
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/profile',
        '/account-settings',
        '/messages',
        '/notifications',
        '/bookmarks',
        '/sign-in',
        '/sign-up',
        '/reset-password',
        '/search',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
