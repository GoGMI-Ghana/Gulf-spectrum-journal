# Gulf Spectrum Journal

The research journal of the Gulf of Guinea Maritime Institute (GoGMI). Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Stack and why

- **Next.js 16 (App Router) + TypeScript** — server-rendered and statically pre-rendered pages (every article, issue, author, and topic page is generated at build time — see the route list `next build` prints), real per-page `<title>`/meta tags for SEO, and a project structure that scales past a single-file content dump.
- **Tailwind CSS v4** — same design tokens (`royal-blue`, `gold`, etc.) as before, defined in `app/globals.css`.
- **`next/font`** — Poppins and Inter are self-hosted and loaded with no render-blocking request, instead of the old `@import url(fonts.googleapis.com...)`.
- **`next/image`** — automatic image optimization/lazy-loading for the logo and cover photos.

## Project structure

```
app/                  Routes (file-based). Each folder under app/ is a URL segment.
  articles/[slug]/    Dynamic route — one page template, one per article.
  issues/[slug]/, topics/[slug]/, authors/[slug]/   Same pattern.
components/           Shared UI. Most are plain Server Components; anything
                       interactive (forms, the account menu, bookmark
                       buttons) is marked 'use client' at the top of the file.
context/              BookmarksContext — client-only, localStorage-backed
                       reading list. Real accounts (see below) would replace
                       this with a `bookmarks` table.
lib/content.ts         All journal content (issues, articles, authors,
                       topics, membership tiers) and the query functions
                       that read it. Every query function is `async`, even
                       though today it just reads the arrays in this file —
                       that's deliberate, so swapping this file for real
                       Supabase queries never requires touching a page.
lib/types.ts            TypeScript interfaces for the content model.
lib/supabase/          Browser/server Supabase clients. Inert until the env
                       vars below are set — nothing calls them yet.
db/schema.sql          Postgres schema matching lib/types.ts, with Row
                       Level Security policies. Written for a Supabase
                       project that doesn't exist yet.
proxy.ts               Refreshes the Supabase auth session cookie on every
                       request (Next 16 renamed "middleware" to "proxy").
                       No-ops until Supabase env vars are set.
```

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + static generation
npm run lint
```

## What's real vs. placeholder

This is a content-and-design prototype, same as the previous Vite version — no backend is connected yet.

- **Real:** every article's data, citations (generated from real author/issue data), search (matches title/abstract/keywords/authors), topic and issue browsing, bookmarks (persisted to `localStorage` in your browser).
- **Placeholder, clearly labeled in the UI:** Analytics view/download counts (deterministic per-article, not real tracking), the donation flow on article pages (no payment provider connected — shows a "no payment was processed" message on submit), Membership "Join" buttons (same pattern), and the Sign In / Create Account menu (explicitly says accounts aren't wired up).

## Turning this into a real backend

1. **Create a Supabase project** and run `db/schema.sql` against it (SQL Editor, or `supabase db push`).
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the project's API settings.
3. Rewrite the query functions in `lib/content.ts` to call `createClient()` from `lib/supabase/server.ts` instead of reading the static arrays. Because every function is already `async` with the same signature, no page or component needs to change.
4. Seed the database from the current placeholder content in `lib/content.ts` (a one-off script, or paste as SQL inserts), then delete the static arrays once the DB is the source of truth.
5. For real payments (donations, membership dues), pick a provider — Paystack or Flutterwave are the common choices for Ghana — and wire it into `components/SupportBox.tsx` and `components/TierCard.tsx`. `db/schema.sql` already has `donations` and `memberships` tables shaped for a Paystack-style transaction/reference flow.
6. For real accounts, use Supabase Auth (`lib/supabase/client.ts` is already set up for it) and replace `context/BookmarksContext.tsx` with a `bookmarks` table query, keyed by `auth.uid()`.
