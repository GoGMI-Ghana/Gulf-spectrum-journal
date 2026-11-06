import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import type { PhotoSlot } from '@/lib/photos'

// Shows a slot's photo, or an empty frame of the same shape while the
// photo hasn't been supplied yet. The empty frame is decorative only, so
// screen readers skip it.
export default function Photo({
  slot,
  sizes,
  className = '',
}: {
  slot: PhotoSlot
  sizes: string
  className?: string
}) {
  const aspectRatio = `${slot.width} / ${slot.height}`
  if (!slot.src) {
    return (
      <div
        aria-hidden="true"
        style={{ aspectRatio }}
        className={`flex items-center justify-center bg-slate-100 border border-dashed border-slate-300 text-slate-400 ${className}`}
      >
        <ImageIcon size={32} strokeWidth={1.5} />
      </div>
    )
  }
  return (
    <div style={{ aspectRatio }} className={`relative overflow-hidden ${className}`}>
      <Image src={slot.src} alt={slot.alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}
