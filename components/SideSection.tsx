import type { ReactNode } from 'react'

// A section of a page's side column: a serif heading over a rule, then
// plain content. Used instead of coloured boxes, so side columns read like
// a journal's margin rather than a row of cards.
export default function SideSection({
  title,
  children,
  className = '',
}: {
  title: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <h2 className="font-display text-lg text-royal-blue pb-2 border-b border-slate-300 mb-3">{title}</h2>
      {children}
    </section>
  )
}
