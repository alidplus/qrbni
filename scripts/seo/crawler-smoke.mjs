#!/usr/bin/env node
/**
 * No-JS crawler smoke checks for public SEO routes.
 * Usage: BASE_URL=https://preview.qrbni.dev npm run seo:smoke
 */
const BASE = (process.env.BASE_URL || "https://preview.qrbni.dev").replace(
  /\/$/,
  "",
);

const ROUTES = [
  "/en",
  "/fa",
  "/en/services",
  "/fa/services",
  "/en/experience",
  "/fa/experience",
  "/en/blog",
  "/fa/blog",
  "/en/contact",
  "/fa/contact",
];

const EMPTY_MARKERS = [
  "Experience will appear here once loaded from NocoDB.",
  "Offerings will appear here once published in NocoDB.",
  "خدمات پس از انتشار در NocoDB اینجا نمایش داده می‌شوند.",
  "سوابق پس از بارگذاری از NocoDB اینجا نمایش داده می‌شوند.",
];

function extractMain(html) {
  const m = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
  return m ? m[0] : "";
}

function hasMeta(html, name) {
  return new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=`,
    "i",
  ).test(html);
}

function hasCanonical(html) {
  return /rel=["']canonical["']/i.test(html);
}

function hasHreflang(html) {
  return (
    /hreflang=["']en["']/i.test(html) &&
    /hreflang=["']fa["']/i.test(html) &&
    /hreflang=["']x-default["']/i.test(html)
  );
}

function jsonLdTypes(html) {
  const types = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item && typeof item === "object" && item["@type"]) {
          types.push(String(item["@type"]));
        }
      }
    } catch {
      // ignore malformed
    }
  }
  return types;
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "user-agent": "qrbni-crawler-smoke/1.0",
      accept: "text/html,application/xml,text/plain,*/*",
    },
    redirect: "follow",
  });
  const text = await res.text();
  return { status: res.status, text, contentType: res.headers.get("content-type") };
}

function emptyMainErrors(main) {
  const errors = [];
  for (const marker of EMPTY_MARKERS) {
    if (main.includes(marker)) {
      errors.push(`empty CMS placeholder in <main>: ${marker.slice(0, 40)}…`);
    }
  }
  return errors;
}

async function checkPage(path) {
  let { status, text } = await fetchText(path);
  const errors = [];
  if (status !== 200) errors.push(`HTTP ${status}`);
  if (!/<title>[^<]+<\/title>/i.test(text)) errors.push("missing title");
  if (!hasMeta(text, "description")) errors.push("missing description");
  if (!hasCanonical(text)) errors.push("missing canonical");
  if (!hasHreflang(text)) errors.push("missing hreflang set");

  let main = extractMain(text);
  let emptyErrors = emptyMainErrors(main);
  // One retry after pause — cold Workers can still hit NocoDB 429.
  if (emptyErrors.length) {
    await new Promise((r) => setTimeout(r, 3000));
    ({ status, text } = await fetchText(path));
    main = extractMain(text);
    emptyErrors = emptyMainErrors(main);
  }
  errors.push(...emptyErrors);

  if (path === "/en" || path === "/fa") {
    const types = jsonLdTypes(text);
    if (!types.includes("Person")) errors.push("missing Person JSON-LD");
    if (!types.includes("WebSite")) errors.push("missing WebSite JSON-LD");
    if (!types.includes("ProfilePage")) errors.push("missing ProfilePage JSON-LD");
    if (!text.includes("#person")) errors.push("missing Person @id #person");
  }

  return errors;
}

async function checkSitemap() {
  const { status, text, contentType } = await fetchText("/sitemap.xml");
  const errors = [];
  if (status !== 200) errors.push(`HTTP ${status}`);
  if (!String(contentType || "").includes("xml")) {
    errors.push(`unexpected content-type: ${contentType}`);
  }
  if (!text.includes("<urlset") || !text.includes("</urlset>")) {
    errors.push("invalid urlset");
  }
  for (const path of ["/en", "/en/services", "/en/experience", "/fa"]) {
    if (!text.includes(`https://qrbni.dev${path}<`) && !text.includes(`https://qrbni.dev${path}</`)) {
      // loc may be written as https://qrbni.dev/en without trailing slash
      if (!text.includes(`https://qrbni.dev${path}`)) {
        errors.push(`sitemap missing ${path}`);
      }
    }
  }
  if (!text.includes('hreflang="x-default"')) {
    errors.push("sitemap missing x-default hreflang");
  }
  return errors;
}

async function checkRobots() {
  const { status, text } = await fetchText("/robots.txt");
  const errors = [];
  if (status !== 200) errors.push(`HTTP ${status}`);
  if (BASE.includes("preview") && !/Disallow:\s*\//i.test(text)) {
    errors.push("preview robots should Disallow: /");
  }
  if (!BASE.includes("preview") && !/Sitemap:\s*https:\/\/qrbni\.dev\/sitemap\.xml/i.test(text)) {
    errors.push("production robots missing sitemap line");
  }
  return errors;
}

async function main() {
  console.log(`SEO smoke → ${BASE}`);
  let failed = 0;

  for (const path of ROUTES) {
    const errors = await checkPage(path);
    if (errors.length) {
      failed += 1;
      console.error(`FAIL ${path}`);
      for (const e of errors) console.error(`  - ${e}`);
    } else {
      console.log(`ok   ${path}`);
    }
    // Pace requests so preview Worker does not stampede NocoDB.
    await new Promise((r) => setTimeout(r, 1500));
  }

  const sm = await checkSitemap();
  if (sm.length) {
    failed += 1;
    console.error("FAIL /sitemap.xml");
    for (const e of sm) console.error(`  - ${e}`);
  } else {
    console.log("ok   /sitemap.xml");
  }

  const rb = await checkRobots();
  if (rb.length) {
    failed += 1;
    console.error("FAIL /robots.txt");
    for (const e of rb) console.error(`  - ${e}`);
  } else {
    console.log("ok   /robots.txt");
  }

  if (failed) {
    console.error(`\n${failed} check group(s) failed`);
    process.exit(1);
  }
  console.log("\nAll crawler smoke checks passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
