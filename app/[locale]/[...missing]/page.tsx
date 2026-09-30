import { notFound } from 'next/navigation'

// proxy.ts rewrites every unknown URL (/nope) to /{locale}/nope, which
// would otherwise fall through to Next's bare default 404 outside any
// layout. Catching it here instead renders [locale]/not-found.tsx inside
// the normal header/footer, in the visitor's language.
export default function CatchAllNotFound() {
  notFound()
}
