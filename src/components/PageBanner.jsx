export default function PageBanner({ eyebrow, title, description }) {
  return (
    <section className="bg-royal-blue border-b-2 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {eyebrow && (
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">{eyebrow}</p>
        )}
        <h1 className="font-serif-display text-white text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="text-white/75 mt-3 max-w-2xl">{description}</p>}
      </div>
    </section>
  )
}
