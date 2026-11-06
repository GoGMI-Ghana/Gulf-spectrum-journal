import type { ReactNode } from 'react'

// The title block at the top of a page: a quiet band with the title in the
// journal's serif. Deliberately light — the masthead above is the one
// large block of colour on every page.
export default function PageBanner({
  title,
  description,
}: {
  title: string
  description?: ReactNode
}) {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="font-display text-royal-blue text-3xl sm:text-4xl leading-tight">{title}</h1>
        {description && <p className="text-slate-700 mt-3 max-w-3xl leading-relaxed">{description}</p>}
      </div>
    </section>
  )
}
