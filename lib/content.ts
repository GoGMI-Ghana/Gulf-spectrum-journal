// Content queries — backed by the self-hosted Supabase Postgres instance
// (see gulf-spectrum-backend/supabase/migrations for the schema, and
// self-hosting/ for where it actually runs). Every exported function here
// is async, which is why call sites under app/ never needed to change
// shape when this file moved off static arrays — only this file did.
//
// journal and donationSplit live in lib/staticContent.ts,
// not here — this file imports lib/supabase/server.ts (server-only, via
// next/headers), which makes it and everything it exports unusable from a
// Client Component. Header and SupportBox are 'use client' and read
// journal/donationSplit, so those need to come from a module with no
// server-only imports at all.
//
// The four "get whole collection" fetchers (getIssues, getArticles,
// getAuthors, getTopics) are wrapped in React's cache() so that multiple
// calls within one request/render — which happens a lot here, since e.g.
// getArticlesForTopic re-fetches all articles and filters in memory —
// share a single Supabase round trip instead of issuing one each.

import { cache } from 'react'
import { createClient } from './supabase/staticClient'
import type { Article, ArticleSection, Author, BoardMember, EditorialBoardMember, Issue, Topic } from './types'

// --- Row shapes from Supabase --------------------------------------

type TopicRow = { slug: string; label: string; description: string }

type AuthorRow = {
  id: string
  slug: string
  name: string
  credentials: string | null
  affiliation: string | null
  bio: string | null
  photo_url: string | null
  user_id: string | null
  // Many-to-one via authors.user_id -> profiles.id, so PostgREST can
  // infer this as an object or an array depending on whether generated
  // DB types are in play — same situation as every other embed in this
  // file, handled the same way in mapAuthorRow.
  profile: { board_title: string | null } | { board_title: string | null }[] | null
}

type IssueRow = {
  slug: string
  number: number
  volume: number
  year: number
  cover_image: string | null
  theme: string
  published_date: string | null
  about_this_volume: string | null
  editorial_board: EditorialBoardMember[] | null
}

type ArticleRow = {
  id: string
  slug: string
  title: string
  abstract: string
  keywords: string[] | null
  sections: ArticleSection[] | null
  conclusion: string | null
  references: string[] | null
  issue: { slug: string } | null
  topic: { slug: string } | null
  article_authors: { position: number; author: { slug: string } | null }[] | null
}

// The 'topics' table has no ordering column. This mirrors the order the
// journal's own scope areas are presented in (see journal.scopeAreas
// above, and how app/about/page.tsx pairs them positionally) — anything
// not in this list (a topic added later) sorts after it, alphabetically.
const TOPIC_ORDER = [
  'maritime-security',
  'blue-economy',
  'regional-governance',
  'capacity-building',
  'consultancy-case-studies',
  'west-african-affairs',
]

function sortTopics(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => {
    const ia = TOPIC_ORDER.indexOf(a.slug)
    const ib = TOPIC_ORDER.indexOf(b.slug)
    if (ia === -1 && ib === -1) return a.label.localeCompare(b.label)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

function mapTopicRow(row: TopicRow): Topic {
  return { slug: row.slug, label: row.label, description: row.description }
}

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function mapAuthorRow(row: AuthorRow): Author {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    credentials: row.credentials ?? '',
    affiliation: row.affiliation ?? '',
    bio: row.bio ?? '',
    photo: row.photo_url,
    boardTitle: one(row.profile)?.board_title ?? null,
    claimed: row.user_id !== null,
  }
}

function mapIssueRow(row: IssueRow): Issue {
  return {
    slug: row.slug,
    number: row.number,
    volume: row.volume,
    year: row.year,
    coverImage: row.cover_image ?? '',
    status: 'published',
    theme: row.theme,
    publishedDate: row.published_date ?? '',
    aboutThisVolume: row.about_this_volume ?? '',
    editorialBoard: row.editorial_board ?? [],
  }
}

function mapArticleRow(row: ArticleRow): Article {
  const authorSlugs = (row.article_authors ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((aa) => aa.author?.slug)
    .filter((s): s is string => Boolean(s))

  return {
    id: row.id,
    slug: row.slug,
    issueSlug: row.issue?.slug ?? '',
    topicSlug: row.topic?.slug ?? '',
    title: row.title,
    authorSlugs,
    abstract: row.abstract,
    keywords: row.keywords ?? [],
    sections: row.sections ?? [],
    conclusion: row.conclusion ?? '',
    references: row.references ?? [],
  }
}

// Every article field a page needs, in one round trip: the parent issue
// and topic (each a many-to-one, so PostgREST returns an object), and the
// ordered list of authors via the article_authors join table (a
// many-to-many, so it comes back as an array). RLS already restricts the
// underlying rows to status = 'published' for the anon/authenticated
// roles this app uses, but the explicit filter below is kept for clarity
// and as a second line of defense if that policy ever changes.
const ARTICLE_SELECT = `
  id,
  slug,
  title,
  abstract,
  keywords,
  sections,
  conclusion,
  "references",
  issue:issues(slug),
  topic:topics(slug),
  article_authors(position, author:authors(slug))
`

// --- Query functions -------------------------------------------------

export const getIssues = cache(async (): Promise<Issue[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('issues')
    .select('slug, number, volume, year, cover_image, theme, published_date, about_this_volume, editorial_board')
    .eq('status', 'published')
    .order('number', { ascending: false })
  if (error) throw error
  return (data as IssueRow[]).map(mapIssueRow)
})

export const getIssueBySlug = cache(async (slug: string): Promise<Issue | undefined> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('issues')
    .select('slug, number, volume, year, cover_image, theme, published_date, about_this_volume, editorial_board')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw error
  return data ? mapIssueRow(data as IssueRow) : undefined
})

// Fetches every published article, fully resolved (issue, topic, ordered
// authors) in one query. The "for X" helpers below filter this in memory
// rather than issuing narrower server-side queries — with a handful of
// articles today that's simpler and no slower; worth revisiting with
// direct filtered queries once the corpus is large enough for it to
// matter (e.g. `.eq('issue.slug', issueSlug)` with an inner join hint).
export const getArticles = cache(async (): Promise<Article[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
  if (error) throw error
  return (data as unknown as ArticleRow[]).map(mapArticleRow)
})

export const getArticleBySlug = cache(async (slug: string): Promise<Article | undefined> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw error
  return data ? mapArticleRow(data as unknown as ArticleRow) : undefined
})

// profile:profiles(board_title) is a left-join embed via authors.user_id
// — most authors have no linked account, so it comes back null for
// them. RLS only exposes that row at all (to anon/authenticated alike)
// when it's a current board member ("board members are publicly
// visible"), so this never leaks anything about non-board profiles.
// The explicit !authors_user_id_fkey is required: profiles.author_id
// also references authors(id) in the other direction, so PostgREST
// can't infer which relationship is meant without it.
const AUTHOR_SELECT = 'id, slug, name, credentials, affiliation, bio, photo_url, user_id, profile:profiles!authors_user_id_fkey(board_title)'

export const getAuthors = cache(async (): Promise<Author[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('authors').select(AUTHOR_SELECT).order('name')
  if (error) throw error
  return (data as unknown as AuthorRow[]).map(mapAuthorRow)
})

export const getAuthorBySlug = cache(async (slug: string): Promise<Author | undefined> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('authors').select(AUTHOR_SELECT).eq('slug', slug).maybeSingle()
  if (error) throw error
  return data ? mapAuthorRow(data as unknown as AuthorRow) : undefined
})

export async function getArticlesForIssue(issueSlug: string): Promise<Article[]> {
  const articles = await getArticles()
  return articles.filter((a) => a.issueSlug === issueSlug)
}

export async function getAuthorsForArticle(article: Article): Promise<Author[]> {
  if (article.authorSlugs.length === 0) return []
  // Goes through the cached full author list rather than its own query —
  // with getArticles() also already fetching every author transitively
  // needed per page, this avoids a separate round trip per article.
  const authors = await getAuthors()
  const bySlug = Object.fromEntries(authors.map((a) => [a.slug, a]))
  return article.authorSlugs.map((s) => bySlug[s]).filter((a): a is Author => Boolean(a))
}

export async function getArticlesForAuthor(authorSlug: string): Promise<Article[]> {
  const articles = await getArticles()
  return articles.filter((a) => a.authorSlugs.includes(authorSlug))
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const articles = await getArticles()
  const results: Article[] = []
  for (const a of articles) {
    const authorNames = (await getAuthorsForArticle(a)).map((au) => au.name).join(' ')
    const haystack = [a.title, a.abstract, ...a.keywords, authorNames].join(' ').toLowerCase()
    if (haystack.includes(q)) results.push(a)
  }
  return results
}

export async function getIssueForArticle(article: Article): Promise<Issue | undefined> {
  return getIssueBySlug(article.issueSlug)
}

export const getTopics = cache(async (): Promise<Topic[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('topics').select('slug, label, description')
  if (error) throw error
  return sortTopics((data as TopicRow[]).map(mapTopicRow))
})

export const getTopicBySlug = cache(async (slug: string): Promise<Topic | undefined> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('topics')
    .select('slug, label, description')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? mapTopicRow(data as TopicRow) : undefined
})

export async function getTopicForArticle(article: Article): Promise<Topic | undefined> {
  return getTopicBySlug(article.topicSlug)
}

export async function getArticlesForTopic(topicSlug: string): Promise<Article[]> {
  const articles = await getArticles()
  return articles.filter((a) => a.topicSlug === topicSlug)
}

type BoardProfileRow = {
  id: string
  full_name: string | null
  board_title: string
  author: { slug: string; photo_url: string | null; bio: string | null } | { slug: string; photo_url: string | null; bio: string | null }[] | null
}

// Public directory of everyone currently on the editorial board — a real
// query, not the hand-typed list in staticContent.ts's journal.editorialBoard
// (that one's the "About the Journal" description of the board as an
// institution; this is "who specifically holds that status right now").
// The `.not('board_title', 'is', null)` filter is redundant with RLS
// ("board members are publicly visible" already restricts anon/authenticated
// to exactly these rows) but kept for clarity, same reasoning as the
// explicit status filters elsewhere in this file.
export const getEditorialBoard = cache(async (): Promise<BoardMember[]> => {
  const supabase = await createClient()
  // !profiles_author_id_fkey for the same reason as AUTHOR_SELECT above,
  // just from the other table: authors<->profiles has two FK paths, so
  // PostgREST needs telling which one this embed means.
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, board_title, author:authors!profiles_author_id_fkey(slug, photo_url, bio)')
    .not('board_title', 'is', null)
    .order('full_name')
  if (error) throw error
  return (data as unknown as BoardProfileRow[]).map((row) => {
    const author = one(row.author)
    return {
      id: row.id,
      name: row.full_name ?? 'Unnamed',
      title: row.board_title,
      authorSlug: author?.slug ?? null,
      photo: author?.photo_url ?? null,
      bio: author?.bio ?? null,
    }
  })
})
