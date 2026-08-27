// Static, non-database content: membership tiers, the journal's own
// masthead info, and the donation split. Deliberately kept in a separate
// module from lib/content.ts, which imports lib/supabase/server.ts (a
// server-only module, via next/headers) — anything that module touches
// becomes unusable from a Client Component. journal and donationSplit are
// both read from 'use client' components (Header, SupportBox), so they
// need to live somewhere with no server-only imports at all.

import type { DonationSplit, Journal, MembershipTier } from './types'

// Real GoGMI membership tiers, sourced from GoGMI-Membership-2026.pdf.
export const membershipTiers: MembershipTier[] = [
  {
    slug: 'student',
    name: 'Student Membership',
    price: 'USD 20/year',
    audience: 'Designed for undergraduate and postgraduate students with an interest in maritime, ocean, environmental, and security studies.',
    benefits: [
      'Official Certificate of Membership',
      'Access to GoGMI research reports and publications',
      'Invitations to student-focused webinars and seminars',
      'Discounted fees for GoGMI trainings and workshops',
      'Structured mentorship opportunities with professionals and researchers',
      'Career development support (research skills, writing clinics, CV guidance)',
      'Access to student networking platforms and discussion groups',
      'Opportunities to volunteer or intern on GoGMI projects',
    ],
  },
  {
    slug: 'associate',
    name: 'Associate Membership',
    subtitle: 'Early Career',
    price: 'USD 100/year',
    audience: 'For early-career professionals (1–5 years of experience) seeking skills development, visibility, and networking.',
    benefits: [
      'Official Certificate of Membership',
      'Invitations to GoGMI conferences, seminars, and policy dialogues',
      'Discounted access to professional training and workshops',
      'Access to research reports, briefs, and policy publications',
      'Career development programmes and capacity-building sessions',
      'Opportunities to contribute to GoGMI blogs, research outputs, and junior committees',
      'Networking with regional and international maritime professionals',
      'Early access to GoGMI fellowships and project calls',
      'Exclusive Member Newsletter',
      'Institutional representation at select engagements',
    ],
    featured: true,
  },
  {
    slug: 'professional',
    name: 'Professional Membership',
    subtitle: "5–10 Years' Experience",
    price: 'USD 200/year',
    audience: 'For mid-level professionals seeking influence, policy engagement, and regional visibility.',
    benefits: [
      'Official Certificate of Membership',
      'Priority invitations to policy dialogues and expert roundtables',
      'Access to GoGMI research outputs and policy briefs',
      'Discounted access to advanced trainings and conferences',
      'Opportunity to moderate sessions or speak at GoGMI events',
      'Opportunity to mentor young graduates interested in maritime affairs',
      'Professional profile listing on the GoGMI website',
      'Executive networking with regional experts and institutions',
      'Exclusive Member Newsletter',
    ],
  },
  {
    slug: 'fellow',
    name: 'Fellow Membership',
    subtitle: 'Senior Experts',
    price: 'By Invitation Only',
    audience: 'For senior professionals and experts contributing to maritime research, policy, and governance.',
    benefits: [
      'Official Certificate of Fellowship',
      'Priority invitations to policy dialogues and expert roundtables',
      'Participation and leadership in policy working groups',
      'Opportunity to moderate sessions or speak at GoGMI events',
      'Opportunity to mentor young graduates interested in maritime affairs',
      'Recognition as a GoGMI Fellow (website and publications)',
      'Engagement in strategic advisory and maritime security discussions',
      'Exclusive Member Newsletter',
      'Institutional representation at select engagements',
    ],
  },
  {
    slug: 'institution',
    name: 'Institution Membership',
    price: 'USD 2,000/year',
    audience: 'For universities, research centres, and think tanks.',
    benefits: [
      'Official Institutional Membership Certificate',
      'Access to GoGMI membership benefits for nominated staff and students',
      'Joint research, training, and capacity-building programmes',
      'Co-branded research outputs and policy publications',
      'Opportunities for joint grant proposals and funded projects',
      'Priority consideration for institutional partnerships and programmes',
      'Institutional visibility on GoGMI platforms',
    ],
  },
  {
    slug: 'corporate',
    name: 'Corporate Membership',
    price: 'USD 4,000/year',
    audience: 'For private sector organisations operating in maritime, logistics, energy, security, and related sectors.',
    benefits: [
      'Official Corporate Membership Certificate',
      'Corporate branding and visibility at GoGMI website, social media, events, and publications',
      'Invitations to high-level advisory events and stakeholder dialogues',
      'Access to customised briefings on maritime and ocean governance issues',
      'Networking with local, regional, and international partners',
      'Opportunities to align CSR initiatives with GoGMI programmes',
    ],
  },
  {
    slug: 'strategic-partner',
    name: 'Strategic Partner',
    price: 'By Invitation Only',
    audience: 'For organisations with long-term strategic alignment with the GoGMI mission.',
    benefits: [
      'Recognition as a GoGMI Strategic Partner',
      'Co-creation and implementation of flagship initiatives',
      'Engagement in strategic planning and policy influence',
      'Priority collaboration on regional and international programmes',
      'Corporate branding and visibility at GoGMI website, social media, events, and publications',
    ],
  },
]

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
