import { Link } from 'react-router-dom'
import { ExternalLink, Mail } from 'lucide-react'
import CompassMark from './CompassMark'
import { journal } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <CompassMark className="w-9 h-9" />
            <span className="font-serif-display text-white text-lg">THE GULF SPECTRUM</span>
          </div>
          <p className="text-sm leading-relaxed max-w-md">
            {journal.subtitle}, published by the Gulf of Guinea Maritime Institute
            (GoGMI). Locally produced, editorially reviewed research on maritime
            governance, safety, and security in the Gulf of Guinea.
          </p>
          <a
            href="https://www.gogmi.org.gh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-soft-gold mt-4"
          >
            gogmi.org.gh <ExternalLink size={14} />
          </a>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Journal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold">About the Journal</Link></li>
            <li><Link to="/issues" className="hover:text-gold">Browse Issues</Link></li>
            <li><Link to="/authors" className="hover:text-gold">Authors</Link></li>
            <li><Link to="/submissions" className="hover:text-gold">Submission Guidelines</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/contact" className="hover:text-gold">Contact the editorial office</Link>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail size={14} /> journal@gogmi.org.gh
            </li>
            <li>{journal.issn}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Gulf of Guinea Maritime Institute. All rights reserved.</p>
          <p>{journal.domain}</p>
        </div>
      </div>
    </footer>
  )
}
