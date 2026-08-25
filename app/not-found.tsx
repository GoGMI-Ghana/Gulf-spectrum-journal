import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Image src="/gogmi-logo.png" alt="" width={64} height={64} className="mx-auto h-16 w-16 object-contain mb-6 opacity-80" />
      <p className="kicker text-ocean-blue mb-2">404</p>
      <h1 className="text-3xl font-bold text-royal-blue font-display mb-3">Page Not Found</h1>
      <p className="text-slate-600 mb-8">
        The page you&apos;re looking for has drifted off course. Let&apos;s get you back on course.
      </p>
      <Link href="/" className="inline-block bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold px-6 py-3 transition-colors tracking-wide">
        Return Home
      </Link>
    </div>
  )
}
