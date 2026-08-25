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
  articleSlugs: string[]
}

export interface ArticleSection {
  heading: string
  body: string
}

export interface Article {
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

export interface MembershipTier {
  slug: string
  name: string
  subtitle?: string
  price: string
  audience: string
  benefits: string[]
  featured?: boolean
}

export interface DonationSplit {
  authorPercent: number
  platformPercent: number
}
