// Crossref DOI registration for one published issue (editors only).
//
//   GET  ?format=xml   the deposit file to upload in Crossref's admin tool,
//                      using each article's DOI, or the suggested one for
//                      articles that don't have one yet.
//   GET  (default)     the plan as JSON: which DOI each article will get.
//   POST               saves the suggested DOIs onto the articles. Done
//                      only after Crossref has accepted the upload, so the
//                      site never shows a DOI link that doesn't work yet.
import { NextResponse } from 'next/server'
import { requireEditor } from '@/lib/adminAuth'
import { createClient } from '@/lib/supabase/server'
import { getArticlesForIssue, getAuthorsForArticle, getIssueBySlug } from '@/lib/content'
import { buildDepositXml, publicationDate, suggestDois } from '@/lib/crossref'
import { revalidateContent } from '@/lib/revalidateContent'
import { siteUrl } from '@/lib/seo'

async function loadPlan(issueId: string) {
  const supabase = await createClient()
  const { data: row } = await supabase.from('issues').select('slug, status').eq('id', issueId).maybeSingle()
  if (!row) return { error: NextResponse.json({ error: 'Issue not found.' }, { status: 404 }) }
  if (row.status !== 'published') {
    return { error: NextResponse.json({ error: 'Publish the issue before registering its DOIs.' }, { status: 409 }) }
  }
  const issue = await getIssueBySlug(row.slug)
  const articles = issue ? await getArticlesForIssue(issue.slug) : []
  if (!issue || articles.length === 0) {
    return { error: NextResponse.json({ error: 'This issue has no published articles.' }, { status: 409 }) }
  }

  // Every DOI already used anywhere in the journal, drafts included, so a
  // suggestion can never repeat one.
  const { data: taken } = await supabase.from('articles').select('doi').not('doi', 'is', null)
  const suggested = suggestDois(articles, publicationDate(issue).year, (taken ?? []).map((r) => r.doi as string))
  const entries = await Promise.all(
    articles.map(async (article) => ({
      article,
      authors: await getAuthorsForArticle(article),
      doi: article.doi || suggested.get(article.id)!,
      url: `${siteUrl}/articles/${article.slug}`,
    }))
  )
  return { supabase, issue, entries, suggested }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireEditor()
  if (auth.error) return auth.error
  const plan = await loadPlan((await params).id)
  if ('error' in plan) return plan.error

  if (new URL(request.url).searchParams.get('format') === 'xml') {
    const xml = buildDepositXml({ issue: plan.issue, entries: plan.entries, siteUrl })
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="crossref-gsj-vol${plan.issue.volume}-no${plan.issue.number}.xml"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  return NextResponse.json({
    articles: plan.entries.map((e) => ({ title: e.article.title, doi: e.doi, saved: Boolean(e.article.doi) })),
  })
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireEditor()
  if (auth.error) return auth.error
  const plan = await loadPlan((await params).id)
  if ('error' in plan) return plan.error

  let saved = 0
  for (const [articleId, doi] of plan.suggested) {
    // Only fills an empty DOI: a registered DOI is never overwritten.
    const { data, error } = await plan.supabase.from('articles').update({ doi }).eq('id', articleId).is('doi', null).select('id')
    if (error) return NextResponse.json({ error: `Not saved: ${error.message}` }, { status: 500 })
    saved += data?.length ?? 0
  }
  // The article pages show the DOI link from now on.
  if (saved > 0) revalidateContent()
  return NextResponse.json({ saved })
}
