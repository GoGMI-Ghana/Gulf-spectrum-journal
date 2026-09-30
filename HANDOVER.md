# Gulf Spectrum Journal — Project Handover

| | |
|---|---|
| **Project** | Gulf Spectrum Journal, the research journal of the Gulf of Guinea Maritime Institute (GoGMI) |
| **Prepared by** | Ellise Grant Boamah (outgoing developer) |
| **Project start** | August 2026 (first commit: 24 August 2026) |
| **Handover date** | September 2026 |
| **Public site** | https://www.gulfspectrumjournal.com |
| **Backend API** | https://api.gulfspectrumjournal.com (self-hosted Supabase) |
| **Repositories** | [GoGMI-Ghana/Gulf-spectrum-journal](https://github.com/GoGMI-Ghana/Gulf-spectrum-journal) (frontend) · [GoGMI-Ghana/gulf-spectrum-backend](https://github.com/GoGMI-Ghana/gulf-spectrum-backend) (database + server setup) |

This document is the starting point for the next developer. It covers what the system does, how it is built and deployed, how to run it, who holds which accounts, and what is still unfinished. The two repository READMEs and the long comments at the top of most files go into more detail. They explain *why* things are built the way they are, so read them before you change something that looks odd.

---

## 1. What the system does

**Public readers can:**
- Browse issues, articles, authors and topics, and search the journal
- Copy citations in several formats and share articles
- Donate to an article's authors through Paystack
- Read the editorial board directory, apply to join the board, send a contact message, and submit an article proposal

**Signed-in members can:**
- Sign in with email and password, a one-time email code, or Google
- Bookmark articles
- Get notifications when a new issue is published or when a new article appears in a topic they have bookmarked
- Send private 1:1 messages to other members
- Edit their profile, change their password, sign out of all devices, and delete their account
- Claim an existing author page as their own. An editor then approves or declines the claim.

**Editors and admins** get an admin panel at `/admin` where they can manage articles, issues, authors, topics, submissions, contact messages, donations, author claims, editorial board applications, and (admins only) users and roles.

---

## 2. Architecture

```
            Browser
               │
               ▼
┌───────────────────────────────┐        ┌──────────────────────────┐
│  Frontend (Next.js 16)        │        │  Paystack                │
│  Vercel                       │◄──────►│  hosted checkout +       │
│  www.gulfspectrumjournal.com  │ webhook│  charge.success webhook  │
│                               │        └──────────────────────────┘
│  app/api/*  server routes     │        ┌──────────────────────────┐
│  (service-role key lives here)│───────►│  Microsoft Graph         │
└──────────────┬────────────────┘ sendMail│  (auth emails via M365) │
               │                         └──────────────────────────┘
               │ supabase-js (anon key + user session)
               ▼
┌───────────────────────────────────────────────────────────┐
│  Self-hosted Supabase (Docker) on GoGMI's Hostinger VPS   │
│  api.gulfspectrumjournal.com (nginx + certbot in front)   │
│  Postgres · GoTrue Auth · PostgREST · Realtime · Studio   │
│                                                           │
│  GoTrue "Send Email Hook" ──► frontend /api/auth/send-email-hook
└───────────────────────────────────────────────────────────┘
```

**Points to understand early:**

1. **The database is the security boundary.** Every table uses Postgres Row Level Security (RLS). The frontend's admin gate (`components/admin/AdminGate.tsx`) only decides what to show. Access is actually enforced by RLS policies such as `is_editor()` and `is_admin()` in the backend migrations.
2. **Roles** are `reader`, `author`, `editor` and `admin`, stored in `profiles.role`. Signed-in users cannot write that column themselves (it is revoked at the column level). The only way to change a role is `app/api/admin/users/[id]`, which requires the caller to be an admin and refuses to demote the last admin.
3. **The service-role key bypasses RLS.** Only server routes use it, through `lib/supabase/admin.ts`: account deletion, admin user and board management, and the Paystack webhook. Never import it into a `'use client'` file.
4. **Content pages are statically generated** at build time. This is why `context/AccountContext.tsx` reads the session in the browser and not in the root layout: calling `cookies()` there would make every page dynamic.
5. **The Paystack webhook and the email hook live in the frontend** (Next.js route handlers), not as Supabase Edge Functions. The self-hosted function gateway requires an `apikey` header, and Paystack cannot send custom headers.
6. **The interface is available in English, Spanish, French and Portuguese.** Every page lives under `app/[locale]/` and is pre-rendered once per language. URLs don't include the language: `proxy.ts` reads the `NEXT_LOCALE` cookie (set by the switcher in the header), falls back to the browser's language and then English, and internally rewrites `/about` to `/fr/about`. A link like `/fr/about` sets the cookie and redirects to `/about`, which is useful for sharing a page in a specific language. All interface text is in `lib/i18n/dictionaries/` (`en.ts` is the source; TypeScript fails the build if another language is missing a key). Server pages call `getDictionary(locale)` and client components use `useI18n()`. Journal content from the database (article titles, abstracts, bodies, bios, topic names) is **not** translated, and neither is the `/admin` panel or the auth emails.

---

## 3. Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react |
| Auth and data | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Database | PostgreSQL (in self-hosted Supabase), with migrations in `gulf-spectrum-backend/supabase/migrations` |
| Payments | Paystack hosted checkout (GHS) |
| Email | Microsoft Graph `sendMail`, called from GoTrue's Send Email Hook |
| Frontend hosting | Vercel |
| Backend hosting | Hostinger VPS (`srv1275242.hstgr.cloud`, Ubuntu 24.04), Docker Compose, nginx + certbot |

---

## 4. Repository layout

### Frontend: `gulf-spectrum-journal`

```
app/                    Pages and API routes (file-based routing)
  admin/                Editorial admin panel (editor/admin only)
  api/
    account/delete      Deletes the caller's own account (service role)
    admin/...           Users, roles, board membership, author claims (admin/editor gated)
    auth/send-email-hook  GoTrue → Microsoft Graph email delivery
    donations/initiate  Creates a pending donation and returns a Paystack checkout URL
    paystack-webhook    Marks donations completed (HMAC-SHA512 verified)
  auth/callback         OAuth (Google) code exchange
  articles/ issues/ authors/ topics/   Public content (statically generated)
components/             Shared UI; components/admin/ holds the admin panel managers
context/AccountContext.tsx   Signed-in user, role, and bookmarks (client-side)
lib/
  content.ts            Database queries for public content
  staticContent.ts      Non-database config (journal info, donation split)
  adminAuth.ts          requireAdmin() / requireEditor() for API routes
  msGraphMailer.ts      Microsoft Graph token + sendMail
  supabase/             client.ts (browser), server.ts (cookies), staticClient.ts (build time), admin.ts (service role)
proxy.ts                Refreshes the auth session cookie on each request (Next 16's name for middleware)
public/email-templates/ HTML for auth emails
```

### Backend: `gulf-spectrum-backend`

```
supabase/migrations/    Schema history, applied in filename order
supabase/seed.sql       Issue No. 1 content
self-hosting/           deploy.sh, apply-schema.sh, setup-https-nginx.sh, setup-https.sh + README
```

**Main tables:** `profiles`, `topics`, `authors`, `issues`, `articles`, `article_authors`, `bookmarks`, `article_events` (with the `article_stats` and `article_daily_stats` views), `donations`, `notifications`, `conversations`, `messages`, `editorial_board_applications`, `contact_messages`, `submissions`, `author_claims`.

---

## 5. Local development

**Requirements:** Node.js 20+ and Git. Docker Desktop is only needed if you want a local database.

```bash
git clone https://github.com/GoGMI-Ghana/Gulf-spectrum-journal.git
cd Gulf-spectrum-journal
npm install
cp .env.example .env.local   # then fill in values (see section 6)
npm run dev                  # http://localhost:3000
```

Other commands: `npm run build` (production build with static generation) and `npm run lint`.

If `.env.local` points at the live API, **you are working against production data.** For safe local work, run a local database from the backend repo:

```bash
cd gulf-spectrum-backend
npm install
npm run db:start    # local Postgres + Studio in Docker, runs migrations and seed
```

Then copy the local API URL and anon key it prints into the frontend's `.env.local`.

---

## 6. Environment variables

The frontend `.env.example` documents every variable. Set them in `.env.local` locally and in **Vercel → Project → Settings → Environment Variables** in production.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase API URL (`https://api.gulfspectrumjournal.com`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key. Safe to expose because RLS protects the data. |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS. Used by admin, account-delete and webhook routes. |
| `PAYSTACK_SECRET_KEY` | **server only** | Starts checkouts and verifies webhook signatures |
| `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET` | **server only** | Azure/Entra app registration with the `Mail.Send` application permission |
| `MS_SENDER_EMAIL` | server | Mailbox that auth emails are sent from |
| `SEND_EMAIL_HOOK_SECRET` | **server only** | Shared with GoTrue's `GOTRUE_HOOK_SEND_EMAIL_SECRETS` (GoTrue stores it as `v1,<value>`) |

On the VPS, the backend's settings live in `~/gulf-spectrum-backend/self-hosting/supabase-project/docker/.env`. That file holds the JWT secret, Postgres password, Studio dashboard login, `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, the Google OAuth credentials and the Send Email Hook settings.

---

## 7. Deployment and operations

### Frontend
Pushing to `main` on GitHub triggers a Vercel deployment. Because content pages are built at build time, **newly published content appears on static pages only after a new deployment.** If editors report that a published article isn't showing, redeploy from Vercel first.

### Backend (VPS)
The full procedure is in `gulf-spectrum-backend/self-hosting/README.md`. In short:

- The stack runs with `docker compose` from `~/gulf-spectrum-backend/self-hosting/supabase-project/docker`.
- Studio (the database dashboard) is reached at the public API URL using `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` from the `.env` file above.
- **The VPS is shared** with GoGMI's intranet and LMS projects, which have their own native Postgres, nginx and certbot. Do not stop or reconfigure services you didn't set up.

### Applying a database change
1. `npx supabase migration new <description>` in the backend repo, then write the SQL.
2. Test it locally with `npm run db:reset` if Docker is available.
3. Apply it to the VPS with `psql -v ON_ERROR_STOP=1` inside the `db` container. The exact command is in the backend README.
4. Never edit a migration that has already been applied. Always add a new one.

### Known gotchas
- **`SITE_URL` / `ADDITIONAL_REDIRECT_URLS`** in the VPS `.env` must match the real frontend URL. If they don't, Google sign-in silently redirects users to `localhost:3000`. This has already happened once.
- **Pooler crash loop with a "name resolution" error** means port 5432 is already taken on the host. `deploy.sh` handles this.
- **Analytics dates are in UTC** to match Postgres. See the comment in `lib/analyticsData.ts`.

### Giving someone admin access
Once at least one admin exists, go to `/admin/users` and change the person's role. To create the first admin, or to recover if no admin is left, run this in Studio's SQL editor: `update profiles set role = 'admin' where id = '<user uuid>';`

---

## 8. Accounts and credentials to transfer

Credentials are not stored in the repositories. Before the handover is complete, check that GoGMI (not a personal account) owns each item below and that the new developer has access:

- [ ] GitHub organisation **GoGMI-Ghana**: admin or write access to both repos
- [ ] **Vercel** project: team access, and the production environment variables
- [ ] **Hostinger** VPS: panel login and SSH access (root or a sudo user)
- [ ] **Domain / DNS** for `gulfspectrumjournal.com` (A record for `api.` points to the VPS)
- [ ] **Supabase Studio** dashboard login (from the VPS `.env`)
- [ ] **Paystack** dashboard: API keys and the webhook URL (`https://www.gulfspectrumjournal.com/api/paystack-webhook`)
- [ ] **Microsoft Entra ID** app registration used for email, and the sender mailbox
- [ ] **Google Cloud** OAuth client used for "Sign in with Google" (redirect URI: `https://api.gulfspectrumjournal.com/auth/v1/callback`)
- [ ] A **Supabase Cloud** project ("GoGMI-Ghana's Project") also exists but is **not used**. Keep it or delete it.

> ⚠️ **Rotate these secrets as part of the handover:** the Microsoft Graph client secret (flagged "rotate after testing" when it was set up on 8 September 2026), `SEND_EMAIL_HOOK_SECRET`, and the Paystack secret key. Do the same for any other credential that was shared informally during development. After rotating, update Vercel and the VPS `.env`.

---

## 9. Current status

### Working in production
- Public journal: issues, articles, authors, topics, search, citations and sharing
- Accounts: email+password, email OTP, Google sign-in, forgot/reset password
- Auth emails sent through Microsoft Graph
- Bookmarks, notifications, private messages, profile and account settings, account deletion
- Real article view tracking and the analytics dashboard
- Paystack donations (hosted checkout + verified webhook)
- Contact form, article submissions, editorial board applications and directory, author claiming
- Full editorial admin panel

### Open items and recommended next steps
1. **Confirm the donation split.** `lib/staticContent.ts` shows donors a 90% / 10% author/platform split. It is a **placeholder**, and GoGMI has not set an official rate.
2. **Paystack live mode.** Confirm whether the keys in Vercel are test or live keys, and that the webhook URL is registered in the Paystack dashboard. Then run one real low-value donation end to end.
3. **Sign-up email confirmation.** The Auth service has `ENABLE_EMAIL_AUTOCONFIRM` turned on, so new accounts are not asked to verify their email. Now that email delivery works, consider turning it off.
4. **Image uploads.** Editors paste image URLs for author photos and issue covers, and there is no upload flow yet. `next.config.ts` allows any `https` image host for this reason. Supabase Storage is already running and could be used for uploads.
5. **Automatic rebuilds on publish.** Consider on-demand revalidation or a Vercel deploy hook, so editors don't need a developer to redeploy after publishing.
6. **Backups.** Set up scheduled `pg_dump` backups of the VPS database to off-server storage, and test a restore. None are set up at the moment.
7. **Tests and CI.** There is no automated test suite. At minimum, add `npm run lint` and `npm run build` checks on pull requests.
8. **Keep the stack updated.** Update the Supabase Docker images (see "Updating later" in the self-hosting README) and the npm dependencies regularly.
9. **Outdated documentation to be aware of.** The backend `.env.example` and parts of the self-hosting README still mention a Paystack *Edge Function*. That was removed, and the webhook now lives in the frontend.

---

## 10. Project timeline

| Date (2026) | Milestone |
|---|---|
| 24 Aug | Prototype; GoGMI branding and editorial design |
| 25 Aug | Migrated from Vite/React Router to Next.js App Router + TypeScript |
| 26 Aug | Initial database schema and seed data (backend repo) |
| 27 Aug | Self-hosted Supabase on the VPS with HTTPS; live content, real accounts, bookmarks and analytics |
| 31 Aug – 1 Sep | Profiles, notifications, private messages, account settings, Paystack donations; membership feature removed |
| 2 Sep | Editorial admin panel |
| 7 Sep | Editorial board; email OTP sign-in |
| 8 Sep | Real contact and submissions backends; auth email through Microsoft Graph |
| 9 Sep | Forgot-password flow; author self-service claiming |
| 15 Sep | Donation RLS fix; email template updated for the custom domain |

The full history is in `git log` in each repository. Commit messages describe the reasoning behind each change.

---

## 11. Contact

**Ellise Grant Boamah**, outgoing developer
GoGMI: info@gogmi.org.gh
