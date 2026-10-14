import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticles, getTopics, getAuthors, getTopicForArticle, getAuthorsForArticle } from '@/lib/content'
import { getArticleStatsById, getArticleDailyStatsById, type ArticleStat } from '@/lib/analytics'
import { createClient } from '@/lib/supabase/server'
import { getDictionary } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/i18n/page'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDictionary((await params).locale)
  return { title: t.analytics.metaTitle, description: t.analytics.metaDescription }
}

// Signed-in readers only, and scoped to the reader: editors and admins see
// every article; anyone else sees the articles of the author profile(s)
// linked to their account (authors.user_id — set when a claim is approved
// or an editor links the profile). Rendered per request, since what it
// shows depends on who is asking.
export default async function AnalyticsPage({ params }: LocaleParams) {
  const t = getDictionary((await params).locale)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?redirect=/analytics')

  const [{ data: profile }, { data: linkedAuthors }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('authors').select('slug').eq('user_id', user.id),
  ])
  const seesEverything = profile?.role === 'editor' || profile?.role === 'admin'
  const mySlugs = new Set((linkedAuthors ?? []).map((a) => a.slug))

  const [allArticles, topics, allAuthors, statsById, dailyStatsById] = await Promise.all([
    getArticles(),
    getTopics(),
    getAuthors(),
    getArticleStatsById(),
    getArticleDailyStatsById(),
  ])
  const articles = seesEverything ? allArticles : allArticles.filter((a) => a.authorSlugs.some((s) => mySlugs.has(s)))

  if (articles.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="font-display text-royal-blue text-2xl mb-4">{t.analytics.title}</h1>
        <p className="text-slate-600 leading-relaxed mb-4">{t.analytics.noArticles}</p>
        <Link href="/authors" className="text-ocean-blue font-medium hover:underline">
          {t.analytics.findProfile}
        </Link>
      </div>
    )
  }

  const topicByArticleSlug: Record<string, string> = {}
  const authorNamesByArticleSlug: Record<string, string[]> = {}
  for (const article of articles) {
    const topic = await getTopicForArticle(article)
    if (topic) topicByArticleSlug[article.slug] = topic.slug
    const articleAuthors = await getAuthorsForArticle(article)
    authorNamesByArticleSlug[article.slug] = articleAuthors.map((a) => a.name)
  }

  // Both analytics views are keyed by article_id — remap to slug here,
  // since that's what the rest of the app (and the dashboard component)
  // already keys everything else by.
  const EMPTY_STAT: ArticleStat = { views: 0, downloads: 0 }
  const statsBySlug: Record<string, ArticleStat> = {}
  const dailyStatsBySlug: Record<string, Record<string, ArticleStat>> = {}
  for (const article of articles) {
    statsBySlug[article.slug] = statsById[article.id] ?? EMPTY_STAT
    dailyStatsBySlug[article.slug] = dailyStatsById[article.id] ?? {}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-royal-blue text-2xl mb-2">{t.analytics.title}</h1>
      <p className="text-sm text-slate-500 mb-6">{seesEverything ? t.analytics.scopeAll : t.analytics.scopeMine}</p>
      <AnalyticsDashboard
        articles={articles}
        topics={topics}
        authors={allAuthors}
        topicByArticleSlug={topicByArticleSlug}
        authorNamesByArticleSlug={authorNamesByArticleSlug}
        statsBySlug={statsBySlug}
        dailyStatsBySlug={dailyStatsBySlug}
      />
    </div>
  )
}
