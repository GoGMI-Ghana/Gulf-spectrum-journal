// Browser-side trigger for revalidating the public site after an admin
// panel write. Awaited by callers so the refresh has been requested before
// the editor navigates away, but never throws: the database write already
// succeeded, and a failed refresh only means the change shows up at the
// next scheduled regeneration (the hourly fallback in
// app/[locale]/layout.tsx) instead of right away — not something to
// surface as a save error.
export async function refreshPublicSite() {
  try {
    const res = await fetch('/api/revalidate', { method: 'POST' })
    if (!res.ok) console.error('Failed to refresh public pages', res.status)
  } catch (err) {
    console.error('Failed to refresh public pages', err)
  }
}
