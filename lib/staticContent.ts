// Static, non-database content: the journal's own masthead info and the
// donation split. Deliberately kept in a separate module from
// lib/content.ts, which imports lib/supabase/server.ts (a server-only
// module, via next/headers) — anything that module touches becomes
// unusable from a Client Component. journal and donationSplit are both
// read from 'use client' components (Header, SupportBox), so they need to
// live somewhere with no server-only imports at all.

import type { DonationSplit, Journal } from './types'

export const journal: Journal = {
  name: 'Gulf Spectrum Journal',
  subtitle: 'A Publication of the Gulf of Guinea Maritime Institute',
  publisher: 'Gulf of Guinea Maritime Institute (GoGMI)',
  domain: 'www.gulfspectrumjournal.com',
  founded: 2025,
  issn: 'ISSN pending',
  frequency: 'Published annually, in themed volumes',
  aboutText: `Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime
Institute (GoGMI), publishing locally produced, insider perspectives on maritime
governance, safety, and security in the Gulf of Guinea. Its mission is to give
stakeholders across the region and beyond a credible, consolidated platform for
research produced by the officers, researchers, and practitioners who work on
these issues directly — as an alternative to research about the region produced
elsewhere.

Each volume is reviewed by a dedicated editorial board of subject-matter experts,
who set that volume's citation style and word-count guidance and oversee the
quality and rigor of its content before publication. The journal supports GoGMI's
wider advocacy and capacity-building work across its four core areas: Research,
Advocacy, Capacity Building, and Consultancy — including flagship initiatives
such as the International Maritime Security Working Group (IMSWG) and the WYTEC
Blue programme for women and youth in the blue economy.`,
  scopeAreas: [
    'Maritime security',
    'Blue economy development',
    'Regional cooperation and governance in the Gulf of Guinea',
    "Capacity building, including youth and women's participation in the blue economy",
    'Consultancy insights and case studies, where suitable for public release',
    'Broader Gulf of Guinea and West African maritime affairs',
  ],
  editorialBoard: [
    { name: 'Rear Admiral (Rtd) E. K. Ansah', role: 'Editor-in-Chief', affiliation: 'Gulf of Guinea Maritime Institute' },
    { name: 'Prof. Adjoa Mensimah Kufuor', role: 'Deputy Editor', affiliation: 'University of Ghana, Faculty of Law' },
    { name: 'Dr. Comfort Adjei-Mensah', role: 'Editorial Board Member', affiliation: 'Institute for Security Studies' },
    { name: 'Capt. Ibrahim Diallo', role: 'Editorial Board Member', affiliation: 'Regional Maritime University' },
  ],
}

// Placeholder split — GoGMI has not set an official rate. Shown to donors
// as an example; confirm the real figure before this goes live.
export const donationSplit: DonationSplit = {
  authorPercent: 90,
  platformPercent: 10,
}
