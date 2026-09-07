import { Award } from 'lucide-react'

// The visible "tag" a board member gets, wherever their identity appears
// (their own account menu/sidebar, their public author page if linked,
// the public editorial board directory). Deliberately shows the actual
// title rather than a generic "Board Member" label — profiles.board_title
// is free text (e.g. "Editor-in-Chief", "Associate Editor"), and losing
// that distinction here would flatten it back to just a flag.
export default function BoardBadge({ title, className = '' }: { title: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-royal-blue bg-soft-gold px-1.5 py-0.5 ${className}`}
    >
      <Award size={10} />
      {title}
    </span>
  )
}
