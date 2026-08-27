'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Logs one real 'view' event per page load, feeding the article_stats /
// article_daily_stats views the Analytics dashboard reads. Client-side
// because the article page itself is statically generated (prerendered
// at build time) — there's no per-request server code to hook a log
// call into, so this fires from the browser after hydration instead.
// Fire-and-forget: a failed log shouldn't affect the reading experience,
// so errors just go to the console rather than surfacing in the UI.
//
// article_events has no 'download' event logged anywhere yet — there's
// no actual download feature on the site (no per-article file to
// download), so that count legitimately stays at zero rather than being
// invented here.
export default function ArticleViewLogger({ articleId }: { articleId: string }) {
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('article_events')
      .insert({ article_id: articleId, event_type: 'view' })
      .then(({ error }) => {
        if (error) console.error('Failed to log article view', error)
      })
    // articleId is the only real dependency; it only changes when
    // Next.js has already remounted this component for a different
    // article (a route change), which is exactly the "log another view"
    // case this is meant to catch — so this doesn't double-fire in
    // practice, and doesn't need suppressing to satisfy exhaustive-deps.
  }, [articleId])

  return null
}
