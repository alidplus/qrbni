import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

function withLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  // Also expose on the response for debugging / edge consumers.
  response.headers.set("x-locale", locale);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
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
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return segment && isLocale(segment) ? segment : defaultLocale;
}
