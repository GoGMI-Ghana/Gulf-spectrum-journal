export default function WaveDivider({ className = 'text-gold' }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`w-full h-4 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 12 C 100 2, 200 22, 300 12 S 500 2, 600 12 S 800 22, 900 12 S 1100 2, 1200 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  )
}
