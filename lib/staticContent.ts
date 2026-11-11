// Static, non-database content: the journal's own masthead info.
// Deliberately kept in a separate module from lib/content.ts, which
// imports lib/supabase/server.ts (a server-only module, via next/headers)
// — anything that module touches becomes unusable from a Client
// Component. journal is read from 'use client' components (Footer), so it
// needs to live somewhere with no server-only imports at all.

import type { Journal } from './types'

// Only the language-independent facts live here. The subtitle, frequency,
// about text and scope areas are translated, so they're in the
// dictionaries (lib/i18n/dictionaries, under `journal`).
export const journal: Journal = {
  name: 'Gulf Spectrum Journal',
  publisher: 'Gulf of Guinea Maritime Institute (GoGMI)',
  domain: 'www.gulfspectrumjournal.com',
  contactEmail: 'info@gogmi.org.gh',
  founded: 2023,
  // Assigned by the Ghana Library Authority (online edition). The UI
  // falls back to the translated "ISSN pending" text if this is null.
  issn: '3057-3521',
}
