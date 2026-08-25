import type { ReactNode } from 'react'

export default function PageBanner({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
}) {
  return (
    <section className="bg-royal-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {eyebrow && <p className="kicker text-gold mb-3">{eyebrow}</p>}
        <h1 className="font-display text-white text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="text-white/70 mt-3 max-w-2xl leading-relaxed">{description}</p>}
      </div>
    </section>
  )
}
