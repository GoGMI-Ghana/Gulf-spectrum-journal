'use client'

import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/context/I18nContext'

// Links to the generated PDF (app/api/articles/[slug]/pdf) and logs a
// 'download' event — the other half of what ArticleViewLogger does for
// views, feeding the Downloads column on the Analytics page. Logged from
// the click rather than in the PDF route so that crawlers and link
// previews fetching the URL don't count as downloads.
export default function DownloadPdfButton({ articleId, slug }: { articleId: string; slug: string }) {
  const { t } = useI18n()

  function logDownload() {
    // Fire-and-forget: a failed log shouldn't get in the way of the file.
    createClient()
      .from('article_events')
      .insert({ article_id: articleId, event_type: 'download' })
      .then(({ error }) => {
        if (error) console.error('Failed to log article download', error)
      })
  }

  return (
    <a
      href={`/api/articles/${slug}/pdf`}
      download
      onClick={logDownload}
      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-royal-blue transition-colors"
    >
      <Download size={16} />
      <span>{t.article.downloadPdf}</span>
    </a>
  )
}
