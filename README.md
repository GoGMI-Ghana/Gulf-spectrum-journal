# Gulf Spectrum Journal

The research journal of the Gulf of Guinea Maritime Institute (GoGMI). Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

Backend (Supabase schema, seed data, edge functions) lives in a companion repo: [gulf-spectrum-backend](https://github.com/GoGMI-Ghana/gulf-spectrum-backend).

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
  membership/[slug]/  Per-tier join page.
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
proxy.ts               Refreshes the Supabase auth session cookie on every
                       request (Next 16 renamed "middleware" to "proxy").
                       No-ops until Supabase env vars are set.
```

The Postgres schema itself (migrations, seed data, RLS policies, the
Paystack webhook) lives in the [gulf-spectrum-backend](https://github.com/GoGMI-Ghana/gulf-spectrum-backend)
repo, not here — that keeps schema changes and edge functions independently
versioned from the frontend, and matches how they'll actually deploy (this
repo to Vercel, that one to Supabase).

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + static generation
npm run lint
```

## What's real vs. placeholder

This is a content-and-design prototype — no backend is connected yet.

- **Real:** every article's data, citations (generated from real author/issue data), search (matches title/abstract/keywords/authors), topic and issue browsing, bookmarks (persisted to `localStorage` in your browser), the Analytics dashboard's stat totals and CSV export (the per-article view/download *numbers* themselves are placeholder — see below).
- **Placeholder, clearly labeled in the UI:** Analytics view/download counts (deterministic per-article, not real tracking), the donation flow on article pages (no payment provider connected — shows a "no payment was processed" message on submit), Membership "Join" forms (same pattern, and deliberately collect only name/email — see the note in `gulf-spectrum-backend`'s README on why no card-entry form was built), and the Sign In / Create Account menu (explicitly says accounts aren't wired up).

## Turning this into a real backend

1. Follow [gulf-spectrum-backend](https://github.com/GoGMI-Ghana/gulf-spectrum-backend)'s README to create a Supabase project and push the schema + seed data to it.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from that project's API settings.
3. Rewrite the query functions in `lib/content.ts` to call `createClient()` from `lib/supabase/server.ts` instead of reading the static arrays. Because every function is already `async` with the same signature, no page or component needs to change.
4. Delete the static arrays in `lib/content.ts` once the database is the source of truth (the seed data in the backend repo mirrors them exactly, so nothing changes for site visitors mid-swap).
5. For real payments (donations, membership dues), pick a provider — Paystack or Flutterwave are the common choices for Ghana. The backend repo's `paystack-webhook` edge function is ready for Paystack specifically; wire the checkout-initiation side into `components/SupportBox.tsx` and `components/JoinForm.tsx`, passing `metadata: { type, record_id }` so the webhook knows which row to mark paid.
6. For real accounts, use Supabase Auth (`lib/supabase/client.ts` is already set up for it) and replace `context/BookmarksContext.tsx` with a `bookmarks` table query, keyed by `auth.uid()`.
