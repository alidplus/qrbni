/** Minimal title-block footer — brand line + Simple Analytics badge. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink/15 bg-paper/40 px-5 py-5 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate">
          © {year} · qrbni.dev
        </p>
        <a
          href="https://dashboard.simpleanalytics.com/?utm_source=qrbni.dev&utm_content=badge&affiliate=rutop-cud"
          referrerPolicy="origin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex opacity-90 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
        >
          <picture>
            <source
              srcSet="https://simpleanalyticsbadges.com/qrbni.dev?mode=light"
              media="(prefers-color-scheme: dark)"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- external SA badge */}
            <img
              src="https://simpleanalyticsbadges.com/qrbni.dev?mode=light"
              alt="Simple Analytics"
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="h-5 w-auto"
              height={20}
            />
          </picture>
        </a>
      </div>
    </footer>
  );
}
