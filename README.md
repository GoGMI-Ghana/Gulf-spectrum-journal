# Gulf Spectrum Journal

The research journal of the Gulf of Guinea Maritime Institute (GoGMI). Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

Backend (Supabase schema, seed data, edge functions, and the self-hosted deployment scripts) lives in a companion repo: [gulf-spectrum-backend](https://github.com/GoGMI-Ghana/gulf-spectrum-backend). This app queries a live instance of it, self-hosted on GoGMI's own VPS at `api.gulfspectrumjournal.com` — not Supabase Cloud.

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
context/              BookmarksContext — tracks the signed-in user (via the
                       browser Supabase client) and their real `bookmarks`
                       table rows. Deliberately client-only rather than
                       read server-side in the root layout: cookies()
                       anywhere in that tree would force every route
                       dynamic, undoing static generation for all the
                       content pages.
lib/auth (none yet)   No server-side "get the current user" helper exists —
                       every page here is either public or reads the
                       session client-side. Add one (reading cookies() via
                       lib/supabase/server.ts) only for a route that
                       genuinely needs to be dynamic anyway, e.g. a future
                       editor-only page — not for anything in the current
                       public-content path.
lib/content.ts         Query functions for database-backed content
                       (issues, articles, authors, topics) — real Supabase
                       queries against the self-hosted instance, not
                       static arrays. Every function is `async`, which is
                       why pages under app/ don't need to know or care
                       that this changed from in-memory arrays.
lib/staticContent.ts   journal, membershipTiers, donationSplit — content
                       that isn't in the database (organizational/config,
                       not editorial). Deliberately separate from
                       lib/content.ts: that file imports server-only code
                       (see below), which would break any 'use client'
                       component that imports anything from it, even a
                       plain static value.
lib/types.ts            TypeScript interfaces for the content model.
lib/supabase/          Three Supabase clients, each for a different
                       context: client.ts (browser — used by
                       BookmarksContext and the sign-in/sign-up forms;
                       real auth is live), server.ts (cookie-aware, for a
                       future session/auth-dependent Server Component read
                       — not used by anything yet, on purpose: see the
                       context/ note above), and staticClient.ts (plain,
                       no cookies — what lib/content.ts actually uses,
                       since its queries are the same for every visitor
                       and some run at build time via generateStaticParams,
                       where there's no request/cookie context at all).
proxy.ts               Refreshes the Supabase auth session cookie on every
                       request (Next 16 renamed "middleware" to "proxy").
                       Now doing real work: keeps a signed-in session
                       valid across server-rendered requests.
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

- **Real:** every article, author, issue, and topic — queried live from Postgres (self-hosted Supabase on GoGMI's VPS, see `gulf-spectrum-backend`), not static arrays. Citations, search, topic and issue browsing. Accounts — email+password sign-up/sign-in/sign-out via Supabase Auth, real sessions, a real `profiles` row per user. Bookmarks — a real `bookmarks` table row per save, scoped by RLS to the signed-in user, not `localStorage`. The Analytics dashboard's stat totals and CSV export (the per-article view/download *numbers* themselves are placeholder — see below).
- **Placeholder, clearly labeled in the UI:** Analytics view/download counts (deterministic per-article, not real tracking — the schema's `article_events` table and `article_stats` view exist for this, just not wired up to log real events yet), the donation flow on article pages (no payment provider connected — shows a "no payment was processed" message on submit), Membership "Join" forms (same pattern, and deliberately collect only name/email — see the note in `gulf-spectrum-backend`'s README on why no card-entry form was built), and — inside the account menu specifically — My Profile / Messages / Notifications / Account Settings, which need the editorial CMS described in the site brief.
- **Not built, and worth knowing why:** password reset / "forgot password". The self-hosted Auth service is on its default dev SMTP settings (a fake mail host that isn't even part of the running stack) — no real email delivery is configured, so a reset-link flow would fail silently. Sign-up works around this by auto-confirming new accounts instead of emailing a confirmation link. Needs a real SMTP provider before either can be built.

## What's left to connect

1. **Real payments** (donations, membership dues) — pick a provider (Paystack or Flutterwave are the common choices for Ghana). The backend repo's `paystack-webhook` edge function is ready for Paystack specifically; wire the checkout-initiation side into `components/SupportBox.tsx` and `components/JoinForm.tsx`, passing `metadata: { type, record_id }` so the webhook knows which row to mark paid.
2. **Real analytics tracking** — log actual view/download events into `article_events` (an insert per page view, gated by RLS to insert-only for anon/authenticated) instead of the deterministic placeholder numbers in `lib/analyticsData.ts`.
3. **Real SMTP**, to unblock password reset and email-confirmed sign-up (see above).
