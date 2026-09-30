// Two jobs on every request:
//
// 1. Language. Pages live under app/[locale]/, but URLs don't carry the
//    locale — this internally rewrites /about to /{locale}/about, picking
//    the language from the NEXT_LOCALE cookie (set by the header's
//    language switcher), else the browser's Accept-Language, else
//    English. Because it's a rewrite, not a redirect, the address bar and
//    every existing link stay exactly as they were. A request that does
//    start with a locale (/fr, /fr/about) is treated as "switch to this
//    language": it sets the cookie and redirects to the unprefixed URL,
//    which makes language-specific links shareable.
//
// 2. Auth. Refreshes the Supabase auth session cookie, per the standard
//    @supabase/ssr Next.js pattern. Inert until Supabase env vars are set
//    — createServerClient just no-ops without them.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from '@/lib/i18n/config'

const ONE_YEAR = 60 * 60 * 24 * 365

// Route handlers and files that must never be rewritten into [locale].
function isUnlocalizedPath(pathname: string) {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    // Anything with a file extension: public/ assets (email templates,
    // images) and app/icon.png.
    /\.[^/]+$/.test(pathname)
  )
}

function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.toLowerCase().split('-')[0], q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  const match = preferred.find((p) => isLocale(p.lang))
  return match ? (match.lang as Locale) : null
}

function resolveLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie
  return localeFromAcceptLanguage(request.headers.get('accept-language')) ?? defaultLocale
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const prefix = pathname.split('/')[1]
  if ((locales as readonly string[]).includes(prefix)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(prefix.length + 1) || '/'
    const redirect = NextResponse.redirect(url)
    redirect.cookies.set(LOCALE_COOKIE, prefix, { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' })
    return redirect
  }

  let rewriteUrl: URL | null = null
  if (!isUnlocalizedPath(pathname)) {
    rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = `/${resolveLocale(request)}${pathname === '/' ? '' : pathname}`
  }
  const nextResponse = () =>
    rewriteUrl ? NextResponse.rewrite(rewriteUrl, { request }) : NextResponse.next({ request })

  let response = nextResponse()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = nextResponse()
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
