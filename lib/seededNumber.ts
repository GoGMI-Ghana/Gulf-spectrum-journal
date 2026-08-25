// Deterministic placeholder numbers (seeded by slug) so they stay stable
// across reloads instead of jumping around on every render. Swap for real
// pageview/download tracking once the backend is connected.
export function seededNumber(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const normalized = Math.abs(hash % 1000) / 1000
  return Math.floor(min + normalized * (max - min))
}
