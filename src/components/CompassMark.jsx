export default function CompassMark({ className = 'w-10 h-10' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#003366" stroke="#DAA520" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="#DAA520" strokeWidth="0.75" opacity="0.6" />
      <g stroke="#DAA520" strokeWidth="0.75" opacity="0.5">
        <line x1="24" y1="4" x2="24" y2="44" />
        <line x1="4" y1="24" x2="44" y2="24" />
      </g>
      <path d="M24 9 L27.5 24 L24 39 L20.5 24 Z" fill="#DAA520" />
      <path d="M9 24 L24 20.5 L39 24 L24 27.5 Z" fill="#F5E6D3" opacity="0.85" />
      <circle cx="24" cy="24" r="2.2" fill="#F5E6D3" stroke="#DAA520" strokeWidth="0.5" />
    </svg>
  )
}
