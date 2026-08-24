import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'

export default function AuthorCard({ author }) {
  return (
    <Link
      to={`/authors/${author.slug}`}
      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-gold hover:shadow-sm transition-all bg-white"
    >
      <div className="w-14 h-14 rounded-full bg-soft-gold flex items-center justify-center shrink-0 border border-gold/40">
        <UserRound className="text-royal-blue" size={26} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-royal-blue truncate">{author.name}</p>
        <p className="text-sm text-slate-500 truncate">{author.affiliation}</p>
      </div>
    </Link>
  )
}
