import Initials, { avatarSizes } from './Initials'

// An author's photo when one has been uploaded (authors.photo_url), else
// the initials tile — same size and footprint either way, so layouts don't
// shift depending on which authors have photos yet. Decorative (alt=""),
// like the initials tile: the name is always shown right next to it.
export default function AuthorAvatar({
  name,
  photo,
  size = 'md',
  className = '',
}: {
  name: string
  photo: string | null
  size?: keyof typeof avatarSizes
  className?: string
}) {
  if (!photo) return <Initials name={name} size={size} className={className} />
  return (
    // Plain <img>, not next/image: photo_url can be any URL an editor
    // pasted, not only the journal's own Storage bucket.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt="" className={`${avatarSizes[size]} object-cover shrink-0 ${className}`} />
  )
}
