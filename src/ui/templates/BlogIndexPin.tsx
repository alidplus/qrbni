import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { BlogListItem } from "@/domains/blog";
import { SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  title: string;
  support: string;
  empty: string;
  read: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Blog",
    support: "Technical notes and product delivery — published when ready.",
    empty: "No published posts in this language yet.",
    read: "Read",
  },
  fa: {
    title: "بلاگ",
    support: "یادداشت‌های فنی و تحویل محصول — وقتی آماده باشد منتشر می‌شود.",
    empty: "هنوز پستی به این زبان منتشر نشده است.",
    read: "مطالعه",
  },
};

type Props = {
  locale: Locale;
  posts: BlogListItem[];
};

function formatDate(value: string | null, locale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function BlogIndexPin({ locale, posts }: Props) {
  const t = copy[locale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <header>
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink uppercase sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-slate sm:text-lg">
            {t.support}
          </p>
        </header>

        {posts.length === 0 ? (
          <div
            className="pin-sheet pin-settle relative mt-14 px-7 py-10"
            style={{ ["--pin-rot" as string]: "0.4deg" }}
          >
            <span
              aria-hidden
              className="tape absolute -top-1 start-8 h-3 w-12 -rotate-2"
            />
            <p className="text-base text-slate">{t.empty}</p>
            <p
              aria-hidden
              className="redline-mark mt-6 font-display text-xs font-bold tracking-[0.2em] uppercase"
            >
              DRAFT WALL
            </p>
          </div>
        ) : (
          <ul className="mt-14 space-y-4">
            {posts.map((post, i) => {
              const dateLabel = formatDate(post.publishedAt, locale);
              return (
                <li
                  key={post.id}
                  className="pin-sheet pin-settle relative px-6 py-6 sm:px-8"
                  style={{
                    ["--pin-rot" as string]: i % 2 === 0 ? "-0.35deg" : "0.4deg",
                  }}
                >
                  <span
                    aria-hidden
                    className="tape absolute -top-1 start-6 h-3 w-11 rotate-2"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="hover:text-redline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {dateLabel ? (
                      <time
                        dateTime={post.publishedAt ?? undefined}
                        className="font-display text-[0.7rem] font-semibold tracking-[0.12em] text-slate uppercase"
                      >
                        {dateLabel}
                      </time>
                    ) : null}
                  </div>
                  {post.excerpt ? (
                    <p className="mt-3 max-w-prose text-base leading-relaxed text-slate">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="mt-4 inline-block font-display text-xs font-semibold tracking-[0.14em] text-ink uppercase underline decoration-redline decoration-2 underline-offset-4 hover:text-redline"
                  >
                    {t.read}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
