import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const locales = ["en", "ar", "ru"] as const
const localeSet = new Set(locales)

function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/")
  const candidate = segments[1]

  if (localeSet.has(candidate as (typeof locales)[number])) {
    return candidate as (typeof locales)[number]
  }

  return null
}

function stripLocaleFromPathname(pathname: string, locale: (typeof locales)[number]) {
  if (locale === "en") {
    return pathname
  }

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
  return stripped.startsWith("/") ? stripped : `/${stripped}`
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathLocale = getLocaleFromPathname(pathname)

  if (pathLocale === "en") {
    const target = pathname.replace(/^\/en(?=\/|$)/, "") || "/"
    return NextResponse.redirect(new URL(`${target}${request.nextUrl.search}`, request.url), 308)
  }

  const locale = pathLocale ?? "en"
  const internalPathname = stripLocaleFromPathname(pathname, locale)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)
  requestHeaders.set("x-pathname", pathname)
  requestHeaders.set("x-internal-pathname", internalPathname)
  requestHeaders.set("x-direction", locale === "ar" ? "rtl" : "ltr")

  if (pathLocale && internalPathname !== pathname) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = internalPathname

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next|studio|.*\\..*).*)"],
}
