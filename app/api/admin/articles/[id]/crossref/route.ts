// Crossref DOI registration for one published online-first article (one
// not in an issue yet), editors only. The per-issue route
// (app/api/admin/issues/[id]/crossref) does the same for a whole issue,
// and later re-sends this article with its volume and issue once it is
// placed in one; the DOI stays the same.
//
//   GET  ?format=xml   the deposit file to upload in Crossref's admin tool,
//                      using the article's DOI, or the suggested one.
//   GET  (default)     the plan as JSON: which DOI the article will get.
//   POST               saves the suggested DOI onto the article. Done only
//                      after Crossref has accepted the upload, so the site
//                      never shows a DOI link that doesn't work yet.
import { NextResponse } from 'next/server'
import { requireEditor } from '@/lib/adminAuth'
import { createClient } from '@/lib/supabase/server'
import { getArticles, getAuthorsForArticle } from '@/lib/content'
import { articleOnlineDate, buildDepositXml, suggestDois } from '@/lib/crossref'
import { revalidateContent } from '@/lib/revalidateContent'
import { siteUrl } from '@/lib/seo'

async function loadPlan(articleId: string) {
  const supabase = await createClient()
  const { data: row } = await supabase.from('articles').select('status, issue_id').eq('id', articleId).maybeSingle()
  if (!row) return { error: NextResponse.json({ error: 'Article not found.' }, { status: 404 }) }
  if (row.status !== 'published') {
    return { error: NextResponse.json({ error: 'Publish the article before registering its DOI.' }, { status: 409 }) }
  }
  if (row.issue_id) {
    return { error: NextResponse.json({ error: "This article is in an issue: register it from the issue's Crossref file." }, { status: 409 }) }
  }
  const article = (await getArticles()).find((a) => a.id === articleId)
  if (!article) return { error: NextResponse.json({ error: 'Article not found.' }, { status: 404 }) }

  // Every DOI already used anywhere in the journal, drafts included, so a
  // suggestion can never repeat one.
  const { data: taken } = await supabase.from('articles').select('doi').not('doi', 'is', null)
  const suggested = suggestDois([article], articleOnlineDate(article).year, (taken ?? []).map((r) => r.doi as string))
  const entry = {
    article,
    authors: await getAuthorsForArticle(article),
    doi: article.doi || suggested.get(article.id)!,
    url: `${siteUrl}/articles/${article.slug}`,
  }
  return { supabase, article, entry, suggested }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireEditor()
  if (auth.error) return auth.error
  const plan = await loadPlan((await params).id)
  if ('error' in plan) return plan.error

  if (new URL(request.url).searchParams.get('format') === 'xml') {
    const xml = buildDepositXml({ entries: [plan.entry], siteUrl })
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="crossref-gsj-${plan.article.slug}.xml"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  return NextResponse.json({ title: plan.article.title, doi: plan.entry.doi, saved: Boolean(plan.article.doi) })
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireEditor()
  if (auth.error) return auth.error
  const plan = await loadPlan((await params).id)
  if ('error' in plan) return plan.error

  const doi = plan.suggested.get(plan.article.id)
  if (!doi) return NextResponse.json({ saved: 0 })
  // Only fills an empty DOI: a registered DOI is never overwritten.
  const { data, error } = await plan.supabase.from('articles').update({ doi }).eq('id', plan.article.id).is('doi', null).select('id')
  if (error) return NextResponse.json({ error: `Not saved: ${error.message}` }, { status: 500 })
  // The article page shows the DOI link from now on.
  if (data?.length) revalidateContent()
  return NextResponse.json({ saved: data?.length ?? 0 })
}
