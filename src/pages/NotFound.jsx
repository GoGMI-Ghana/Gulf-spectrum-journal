import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page Not Found')

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Compass className="mx-auto text-gold mb-5" size={48} />
      <h1 className="text-3xl font-bold text-royal-blue mb-3">Page Not Found</h1>
      <p className="text-slate-600 mb-8">
        The page you're looking for has drifted off course. Let's get you back on course.
      </p>
      <Link to="/" className="inline-block bg-gold hover:bg-soft-gold hover:text-royal-blue text-ink font-semibold px-6 py-3 rounded transition-colors">
        Return Home
      </Link>
    </div>
  )
}
