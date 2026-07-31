import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRODUCTION_HOST } from "@/config/site";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { VISITOR_COOKIE } from "@/server/visitor";

function ensureVisitorCookie(request: NextRequest, response: NextResponse) {
  const host = request.nextUrl.hostname.toLowerCase();
  // Only mint on production apex — preview/local stay cookieless for this.
  if (host !== PRODUCTION_HOST) return;

  const existing = request.cookies.get(VISITOR_COOKIE)?.value;
  if (existing && existing.length >= 8 && existing.length <= 64) return;

  response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
}

function withLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-locale", locale);
  ensureVisitorCookie(request, response);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next();
    ensureVisitorCookie(request, response);
    return response;
  }

  const segment = pathname.split("/")[1];
  if (segment && isLocale(segment)) {
    return withLocale(request, segment);
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("x-locale", defaultLocale);
  ensureVisitorCookie(request, response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return segment && isLocale(segment) ? segment : defaultLocale;
}
