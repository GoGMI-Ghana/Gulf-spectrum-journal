// /sitemap.xml — tells search engines every public page that exists, so a
// newly published article is found without waiting for a crawler to
// stumble on a link to it. Listed once each: this site's URLs carry no
// language prefix (see proxy.ts), so there is one address per page.
//
// Regenerated hourly, and immediately when an editor saves in the admin
// panel (lib/revalidateContent.ts) — the same schedule as the pages.
import type { MetadataRoute } from 'next'
import { getArticles, getAuthors, getIssues, getTopics } from '@/lib/content'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600

const STATIC_PAGES = ['', '/issues', '/topics', '/authors', '/about', '/editorial-board', '/submissions', '/citations', '/correction-policy', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [issues, articles, authors, topics] = await Promise.all([getIssues(), getArticles(), getAuthors(), getTopics()])
  return [
    ...STATIC_PAGES.map((path) => `${siteUrl}${path}`),
    ...issues.map((issue) => `${siteUrl}/issues/${issue.slug}`),
    ...articles.map((article) => `${siteUrl}/articles/${article.slug}`),
    ...topics.map((topic) => `${siteUrl}/topics/${topic.slug}`),
    ...authors.map((author) => `${siteUrl}/authors/${author.slug}`),
  ].map((url) => ({ url }))
}
