import { Link } from 'react-router-dom'
import { journal } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/gogmi-logo.png" alt="GoGMI" className="h-9 w-9 object-contain" />
            <span className="font-display text-white text-lg">Gulf Spectrum Journal</span>
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
            className="inline-block text-sm text-gold hover:text-soft-gold mt-4 border-b border-gold/50 hover:border-soft-gold"
          >
            gogmi.org.gh
          </a>
        </div>

        <div>
          <h3 className="kicker text-white mb-4">Journal</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold">About the Journal</Link></li>
            <li><Link to="/issues" className="hover:text-gold">Articles and Issues</Link></li>
            <li><Link to="/topics" className="hover:text-gold">Topics</Link></li>
            <li><Link to="/authors" className="hover:text-gold">Authors</Link></li>
            <li><Link to="/submissions" className="hover:text-gold">Submission Guidelines</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="kicker text-white mb-4">Contact</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/contact" className="hover:text-gold">Contact the editorial office</Link>
            </li>
            <li>journal@gogmi.org.gh</li>
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
