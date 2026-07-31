import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { serverEnv } from "@/server/env";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const headerSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const querySecret = url.searchParams.get("secret");
  const secret = headerSecret || querySecret;

  if (!secret || secret !== serverEnv.revalidateSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { paths?: string[]; tags?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // NocoDB webhooks may send empty or non-JSON bodies; allow path/tag query params.
  }

  const paths = body.paths ?? url.searchParams.getAll("path");
  const tags = body.tags ?? url.searchParams.getAll("tag");

  for (const path of paths) revalidatePath(path);
  for (const tag of tags) revalidateTag(tag, "max");

  if (paths.length === 0 && tags.length === 0) {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({
    ok: true,
    revalidated: { paths, tags },
    now: Date.now(),
  });
}
