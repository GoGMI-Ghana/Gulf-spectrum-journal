// The site's generic link-preview card — used for every page that
// doesn't have a more specific image (see lib/seo.ts). Lives under /api
// so proxy.ts leaves it alone: social crawlers fetch this URL directly,
// and it shouldn't go through the language rewrite.
import { renderOgCard } from '@/lib/ogCard'
import { journal } from '@/lib/staticContent'

export function GET() {
  return renderOgCard({
    kicker: 'Gulf of Guinea Maritime Institute',
    title: journal.name,
    subtitle: 'Research on maritime governance, safety and security in the Gulf of Guinea',
  })
}
