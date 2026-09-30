'use client'

import { BookOpen, Layers, Users } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

const pills: { icon: typeof BookOpen; label: 'topics' | 'issues' | 'authors'; top: string; left: string }[] = [
  { icon: BookOpen, label: 'topics', top: '8%', left: '18%' },
  { icon: Layers, label: 'issues', top: '42%', left: '52%' },
  { icon: Users, label: 'authors', top: '72%', left: '14%' },
]

export default function CitationHeroGrid() {
  const { t } = useI18n()
  return (
    <div
      className="relative hidden lg:block h-64 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(226 232 240) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 90%)',
      }}
    >
      {pills.map((p) => (
        <span
          key={p.label}
          className="absolute flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm px-3 py-1.5 text-sm text-slate-600"
          style={{ top: p.top, left: p.left }}
        >
          <p.icon size={14} className="text-ocean-blue" />
          {t.citations.heroPills[p.label]}
        </span>
      ))}
    </div>
  )
}
