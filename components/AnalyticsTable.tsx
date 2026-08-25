'use client'

import Link from 'next/link'
import { useBookmarks } from '@/context/BookmarksContext'

export interface AnalyticsRow {
  slug: string
  title: string
  topicLabel: string
  views: number
  downloads: number
}

export default function AnalyticsTable({ rows }: { rows: AnalyticsRow[] }) {
  const { bookmarks } = useBookmarks()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
            <th className="py-3 pr-4 font-medium">Article</th>
            <th className="py-3 pr-4 font-medium">Topic</th>
            <th className="py-3 pr-4 font-medium text-right">Views</th>
            <th className="py-3 pr-4 font-medium text-right">Downloads</th>
            <th className="py-3 font-medium text-right">Bookmarked (this browser)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 pr-4">
                <Link href={`/articles/${row.slug}`} className="text-royal-blue hover:text-ocean-blue font-medium">
                  {row.title}
                </Link>
              </td>
              <td className="py-3 pr-4 text-slate-600">{row.topicLabel}</td>
              <td className="py-3 pr-4 text-right numeral">{row.views.toLocaleString()}</td>
              <td className="py-3 pr-4 text-right numeral">{row.downloads.toLocaleString()}</td>
              <td className="py-3 text-right">{bookmarks.includes(row.slug) ? 'Yes' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
