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
  editorialBoard: EditorialBoardMember[]
}

export interface Author {
  slug: string
  name: string
  credentials: string
  affiliation: string
  bio: string
  photo: string | null
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

// Mirrors the user_role enum in the database. 'editor' and 'admin' can
// reach /admin; only 'admin' can change another account's role (see
// app/api/admin/users — profiles.role itself is revoked from
// authenticated/anon so nothing short of the service-role admin client
// can write it, even for a user's own row).
export type UserRole = 'reader' | 'author' | 'editor' | 'admin'
