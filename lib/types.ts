export interface EditorialBoardMember {
  name: string
  role: string
  affiliation?: string
}

export interface Journal {
  name: string
  subtitle: string
  publisher: string
  domain: string
  founded: number
  issn: string
  frequency: string
  aboutText: string
  scopeAreas: string[]
}

export interface Author {
  id: string
  slug: string
  name: string
  credentials: string
  affiliation: string
  bio: string
  photo: string | null
  // Set only when this author is linked (authors.user_id) to a profile
  // that currently holds a board_title — i.e. this person is both a
  // contributing author and, separately, on the editorial board today.
  // Most authors have no linked account at all, so this is null far
  // more often than not.
  boardTitle: string | null
  // True when authors.user_id is set — i.e. someone has claimed this
  // profile (either self-service or an editor linked it directly).
  // Drives whether the public author page offers a "claim this" CTA.
  claimed: boolean
}

export interface Topic {
  slug: string
  label: string
  description: string
}

export interface Issue {
  slug: string
  number: number
  volume: number
  year: number
  coverImage: string
  status: 'published' | 'draft'
  theme: string
  publishedDate: string
  aboutThisVolume: string
  editorialBoard: { name: string; role: string }[]
}

export interface ArticleSection {
  heading: string
  body: string
}

export interface Article {
  id: string
  slug: string
  issueSlug: string
  topicSlug: string
  title: string
  authorSlugs: string[]
  abstract: string
  keywords: string[]
  sections: ArticleSection[]
  conclusion: string
  references: string[]
}

export interface DonationSplit {
  authorPercent: number
  platformPercent: number
}

// The signed-in reader account (Supabase Auth), not an Author (a
// journal contributor — a separate concept, though profiles.author_id
// can link the two once a reader is a published author with a claimed
// account). Deliberately minimal: just what the UI needs to display.
export interface CurrentUser {
  id: string
  email: string
  fullName: string | null
}

// A profile currently holding a board_title, for the public /editorial-board
// directory. authorSlug is set only if that profile is also linked to an
// Author record (profiles.author_id) — being a board member never requires
// having authored anything, so this is often null.
export interface BoardMember {
  id: string
  name: string
  title: string
  authorSlug: string | null
  photo: string | null
  bio: string | null
}

// Mirrors the user_role enum in the database. 'editor' and 'admin' can
// reach /admin; only 'admin' can change another account's role (see
// app/api/admin/users — profiles.role itself is revoked from
// authenticated/anon so nothing short of the service-role admin client
// can write it, even for a user's own row).
export type UserRole = 'reader' | 'author' | 'editor' | 'admin'
