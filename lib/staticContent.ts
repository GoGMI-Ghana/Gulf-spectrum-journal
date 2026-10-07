// Static, non-database content: the journal's own masthead info and the
// donation split. Deliberately kept in a separate module from
// lib/content.ts, which imports lib/supabase/server.ts (a server-only
// module, via next/headers) — anything that module touches becomes
// unusable from a Client Component. journal and donationSplit are both
// read from 'use client' components (Footer, SupportBox), so they need to
// live somewhere with no server-only imports at all.

import type { DonationSplit, Journal } from './types'

// Only the language-independent facts live here. The subtitle, frequency,
// about text and scope areas are translated, so they're in the
// dictionaries (lib/i18n/dictionaries, under `journal`).
export const journal: Journal = {
  name: 'Gulf Spectrum Journal',
  publisher: 'Gulf of Guinea Maritime Institute (GoGMI)',
  domain: 'www.gulfspectrumjournal.com',
  contactEmail: 'info@gogmi.org.gh',
  founded: 2025,
  // Assigned by the Ghana Library Authority (online edition). The UI
  // falls back to the translated "ISSN pending" text if this is null.
  issn: '3057-3521',
}

// Placeholder split — GoGMI has not set an official rate. Shown to donors
// as an example; confirm the real figure before this goes live.
export const donationSplit: DonationSplit = {
  authorPercent: 90,
  platformPercent: 10,
}
