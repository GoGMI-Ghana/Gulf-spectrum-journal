import { BookOpen, Layers, Users } from 'lucide-react'

const pills = [
  { icon: BookOpen, label: 'Topics', top: '8%', left: '18%' },
  { icon: Layers, label: 'Issues', top: '42%', left: '52%' },
  { icon: Users, label: 'Authors', top: '72%', left: '14%' },
]

export default function CitationHeroGrid() {
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
          {p.label}
        </span>
      ))}
    </div>
  )
}
