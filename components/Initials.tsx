const TITLE_PREFIX = /^(?:(?:Dr|Prof|Capt|Cdr|Lt|Sub-Lt)\.\s+|Rear Admiral \(Rtd\)\s+)+/

function getInitials(name: string): string {
  const cleaned = name.replace(TITLE_PREFIX, '')
  const parts = cleaned.split(' ').filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export const avatarSizes = {
  sm: 'w-10 h-10 text-xs',
  md: 'w-14 h-14 text-base',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-24 h-24 sm:w-32 sm:h-32 text-3xl sm:text-4xl',
} as const

export default function Initials({
  name,
  size = 'md',
  className = '',
}: {
  name: string
  size?: keyof typeof avatarSizes
  className?: string
}) {
  return (
    <div
      className={`${avatarSizes[size]} bg-royal-blue text-gold font-display flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}
