import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { serverEnv } from "@/server/env";
import {
  isRevalidateScope,
  pathsForScope,
  scopeFromTableId,
  scopeFromTableName,
  tagsForScope,
  type NocoWebhookBody,
  type RevalidateScope,
} from "@/server/revalidate-map";

export const dynamic = "force-dynamic";

function authorize(request: Request): boolean {
  const url = new URL(request.url);
  const headerSecret = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  const querySecret = url.searchParams.get("secret");
  const secret = headerSecret || querySecret;
  return Boolean(secret && secret === serverEnv.revalidateSecret());
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(request.url);
  let body: NocoWebhookBody = {};
  try {
    body = (await request.json()) as NocoWebhookBody;
  } catch {
    // Empty body is fine — scopes/paths can come from query params.
  }

  const scopes = new Set<RevalidateScope>();
  const queryScope = url.searchParams.get("scope");
  if (queryScope && isRevalidateScope(queryScope)) scopes.add(queryScope);
  if (body.scope && isRevalidateScope(body.scope)) scopes.add(body.scope);

  const fromId = scopeFromTableId(body.data?.table_id);
  const fromName = scopeFromTableName(body.data?.table_name);
  if (fromId) scopes.add(fromId);
  if (fromName) scopes.add(fromName);

  const paths = new Set<string>([
    ...(body.paths ?? []),
    ...url.searchParams.getAll("path"),
  ]);
  const tags = new Set<string>([
    ...(body.tags ?? []),
    ...url.searchParams.getAll("tag"),
  ]);

  for (const scope of scopes) {
    for (const path of pathsForScope(scope)) paths.add(path);
    for (const tag of tagsForScope(scope)) tags.add(tag);
  }

  if (paths.size === 0 && tags.size === 0) {
    // Unknown/empty webhook — refresh public shells.
    for (const path of pathsForScope("all")) paths.add(path);
    for (const tag of tagsForScope("all")) tags.add(tag);
    revalidatePath("/", "layout");
  }

  for (const path of paths) {
    revalidatePath(path);
    // Blog/section roots: invalidate nested [slug] pages too.
    if (path.endsWith("/blog") || path.endsWith("/services") || path.endsWith("/experience")) {
      revalidatePath(path, "layout");
    }
  }
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({
    ok: true,
    revalidated: {
      scopes: [...scopes],
      paths: [...paths],
      tags: [...tags],
      table: body.data?.table_name ?? body.data?.table_id ?? null,
    },
    now: Date.now(),
  });
}
