import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page Not Found')

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <img src="/gogmi-logo.png" alt="" className="mx-auto h-16 w-16 object-contain mb-6 opacity-80" />
      <p className="kicker text-ocean-blue mb-2">404</p>
      <h1 className="text-3xl font-bold text-royal-blue font-display mb-3">Page Not Found</h1>
      <p className="text-slate-600 mb-8">
        The page you're looking for has drifted off course. Let's get you back on course.
      </p>
      <Link to="/" className="inline-block bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold px-6 py-3 transition-colors tracking-wide">
        Return Home
      </Link>
    </div>
  )
}
