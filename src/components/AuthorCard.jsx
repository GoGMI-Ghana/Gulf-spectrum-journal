import { Link } from 'react-router-dom'
import Initials from './Initials'

export default function AuthorCard({ author }) {
  return (
    <Link
      to={`/authors/${author.slug}`}
      className="flex items-center gap-4 p-4 bg-white hover:bg-soft-gold/40 transition-colors"
    >
      <Initials name={author.name} size="md" />
      <div className="min-w-0">
        <p className="font-semibold text-royal-blue truncate">{author.name}</p>
        <p className="text-sm text-slate-500 truncate">{author.affiliation}</p>
      </div>
    </Link>
  )
}
