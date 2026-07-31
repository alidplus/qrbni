import { serverEnv } from "@/server/env";

type SiteverifyResult = {
  success: boolean;
  "error-codes"?: string[];
};

/**
 * Canonical Turnstile siteverify — fail closed on network/parse/success=false.
 * @see turnstile.md
 */
export async function verifyTurnstileToken(
  token: string,
  remoteip?: string | null,
): Promise<boolean> {
  if (!token) return false;

  let result: SiteverifyResult;
  try {
    const body = new URLSearchParams({
      secret: serverEnv.turnstileSecret(),
      response: token,
    });
    if (remoteip) body.set("remoteip", remoteip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    if (!res.ok) return false;
    result = (await res.json()) as SiteverifyResult;
  } catch {
    return false;
  }

  return result.success === true;
}

export function clientIpFromRequest(request: Request): string | null {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip")?.trim() || null;
}

export async function hashIp(ip: string): Promise<string> {
  const material = `${ip}:${serverEnv.revalidateSecret()}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(material),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
