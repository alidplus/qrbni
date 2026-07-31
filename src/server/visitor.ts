import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PRODUCTION_HOST } from "@/config/site";

export const VISITOR_COOKIE = "qrbni_vid";

export type VisitorContext = {
  visitorId: string;
  /** True when we minted a new id (no valid cookie yet). */
  isNewVisitor: boolean;
  country?: string;
  city?: string;
  userAgent?: string;
};

function readVisitorCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${VISITOR_COOKIE}=([A-Za-z0-9_-]+)`),
  );
  const value = match?.[1];
  if (!value || value.length < 8 || value.length > 64) return null;
  return value;
}

function geoFromCloudflare(): { country?: string; city?: string } {
  try {
    const { cf } = getCloudflareContext();
    if (!cf) return {};
    const country =
      typeof cf.country === "string" && cf.country ? cf.country : undefined;
    const city =
      typeof (cf as { city?: unknown }).city === "string"
        ? ((cf as { city?: string }).city as string)
        : undefined;
    return { country, city: city || undefined };
  } catch {
    return {};
  }
}

/** Resolve visitor id + CF geo + UA from the incoming request. */
export function visitorFromRequest(request: Request): VisitorContext {
  const existing = readVisitorCookie(request.headers.get("cookie"));
  const isNewVisitor = !existing;
  const visitorId = existing ?? crypto.randomUUID();
  const { country, city } = geoFromCloudflare();
  const ua = request.headers.get("user-agent")?.trim();

  return {
    visitorId,
    isNewVisitor,
    country,
    city,
    userAgent: ua ? ua.slice(0, 280) : undefined,
  };
}

export function visitorCookieHeader(
  visitorId: string,
  host: string,
): string {
  const secure = host === PRODUCTION_HOST || host.endsWith(`.${PRODUCTION_HOST}`);
  const parts = [
    `${VISITOR_COOKIE}=${visitorId}`,
    "Path=/",
    `Max-Age=${60 * 60 * 24 * 365}`,
    "SameSite=Lax",
    "HttpOnly",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

/** Lines shared across Telegram notify formats. */
export function formatVisitorTelegramLines(visitor: VisitorContext): string[] {
  const geo =
    visitor.city && visitor.country
      ? `${visitor.city}, ${visitor.country}`
      : visitor.country || visitor.city || undefined;

  return [
    `Visitor: ${visitor.visitorId}${visitor.isNewVisitor ? " (new)" : ""}`,
    geo ? `Geo: ${geo}` : null,
    visitor.userAgent ? `UA: ${visitor.userAgent}` : null,
  ].filter((line): line is string => Boolean(line));
}
