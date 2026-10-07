// Marks every public page, in every language, as stale so the next visit
// regenerates it from the database. Pages are statically generated, so
// without this an editor's publish only showed up after a redeploy.
//
// The path is the route pattern, not a URL: proxy.ts rewrites /about to
// /{locale}/about internally, and revalidatePath needs the destination
// (the actual route file location), not what's in the address bar.
// 'layout' covers the [locale] layout and every page beneath it.
// Regeneration is lazy — each page rebuilds on its next visit, so this is
// cheap no matter how many articles exist.
//
// Server-only (revalidatePath can't run in the browser). The admin
// panel's client-side writes reach it through POST /api/revalidate;
// server routes that change public content call it directly.
import { revalidatePath } from 'next/cache'

export function revalidateContent() {
  revalidatePath('/[locale]', 'layout')
  // Lives outside the [locale] tree, so it isn't covered by the line above.
  revalidatePath('/sitemap.xml')
}
