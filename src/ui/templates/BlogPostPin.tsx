import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { BlogPostDetail } from "@/domains/blog/post";
import { SiteHeader } from "@/ui/organisms/SiteHeader";

type Props = {
  locale: Locale;
  post: BlogPostDetail;
};

/** Minimal Markdown → paragraphs/headings for v1 (no full MD engine yet). */
function renderSimpleMarkdown(source: string) {
  const blocks = source.trim().split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("# ")) {
      return (
        <h2
          key={i}
          className="mt-8 font-display text-2xl font-semibold tracking-[-0.02em] text-ink first:mt-0"
        >
          {trimmed.slice(2)}
        </h2>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={i}
          className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] text-ink"
        >
          {trimmed.slice(3)}
        </h3>
      );
    }
    return (
      <p key={i} className="mt-4 text-base leading-relaxed text-ink first:mt-0">
        {trimmed}
      </p>
    );
  });
}

export function BlogPostPin({ locale, post }: Props) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <Link
          href={`/${locale}/blog`}
          className="font-display text-xs font-semibold tracking-[0.14em] text-slate uppercase hover:text-redline"
        >
          {locale === "fa" ? "← بلاگ" : "← Blog"}
        </Link>
        <article
          className="pin-sheet pin-settle relative mt-8 px-7 py-10 sm:px-10 sm:py-12"
          style={{ ["--pin-rot" as string]: "0.25deg" }}
        >
          <span
            aria-hidden
            className="tape absolute -top-1 start-8 h-3 w-12 -rotate-2"
          />
          <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-base leading-relaxed text-slate">{post.excerpt}</p>
          ) : null}
          <div className="mt-8 border-t border-ink/10 pt-8">
            {renderSimpleMarkdown(post.bodyMarkdown)}
          </div>
        </article>
      </main>
    </div>
  );
}
