# qrbni.dev — Architecture

**Status:** binding for all agents  
**Product:** public personal brand + services + blog site for Ali Ghorbani  
**Domain:** `qrbni.dev` (apex only) · preview `preview.qrbni.dev`  
**Repo:** https://github.com/alidplus/qrbni

Every agent must read this document before changing code, schema, CI, or design system files. Design visuals are owned by **Impeccable**; engineering agents implement Impeccable’s decisions without overriding brand/visual direction.

---

## 1. Goals

- Attractive public CV / resume and personal brand site (EN default + FA).
- Market outcome-led **services** (list + CTA), not a ticket freelancer pitch.
- Full **blog** (Markdown in NocoDB) with SEO.
- Content edited in **NocoDB** (no in-app admin).
- Hosted on **Cloudflare Workers** via **OpenNext** (not classic Pages).
- Fast, cacheable pages (SSG/ISR) with safe dynamic contact intake.

Non-goals (v1): in-site CMS/admin, client-side NocoDB access, React Query / TanStack Query against NocoDB.

---

## 2. Stack

| Layer | Choice |
|---|---|
| Runtime / host | Cloudflare Workers + `@opennextjs/cloudflare` |
| Framework | Next.js App Router (SSR/SSG/ISR as needed) |
| UI | React, Tailwind CSS |
| Structure | Pragmatic Atomic Design (`atoms` → `molecules` → `organisms` → `templates` → pages) |
| Design | Impeccable (`PRODUCT.md`, `DESIGN.md`, surface briefs) |
| CMS / DB | NocoDB base **CV** (`p4cutoefjsz0z2t`) via MCP + REST |
| API client | [Hey API](https://heyapi.dev/) `@hey-api/openapi-ts` — **server-only** SDK, committed to git |
| Forms bot protection | Cloudflare Turnstile (widget already exists; see `turnstile.md`) |
| Analytics | Cloudflare Web Analytics |
| Package manager | npm |
| Node | 22 via `nvm` (pin in `.nvmrc`) |
| i18n routing | `/en/...`, `/fa/...`; `/` → `/en` |

### Explicitly out

- TanStack Query / client SDK talking to NocoDB.
- Exposing `NOCODB_API_TOKEN` (or any PAT) to the browser.
- Deploying production from untagged `main` commits.

---

## 3. High-level architecture

```text
┌─────────────┐     ISR/SSG fetch      ┌──────────────────┐
│  Next.js    │ ─────────────────────► │ NocoDB REST      │
│  (Workers)  │   server-only Hey API  │ (xc-token)       │
│             │ ◄───────────────────── │                  │
│  /api/*     │                        └────────┬─────────┘
│  contact    │                                 │ webhook
│  revalidate │ ◄───────────────────────────────┘
└──────┬──────┘
       │ Turnstile siteverify
       ▼
 Cloudflare Turnstile
```

**Read path:** Server components / generateStaticParams / fetch at build & revalidation use the Hey API client with token from Worker secrets / env.

**Write path (public):** Contact form → Turnstile token → Route Handler verifies Turnstile → inserts row in NocoDB Contacts. No outbound mail in v1 (NocoDB is the inbox). Optional later: Cloudflare Email Sending to verified Gmail. Email Routing may still forward `hello@qrbni.dev` → Gmail (inbound only).

**Revalidate path:** NocoDB webhooks (configured **after** tables exist) → `POST /api/revalidate` with `REVALIDATE_SECRET` → `revalidateTag` / `revalidatePath`. Also time-based ISR as backup.

---

## 4. Domains (DDD)

Code and NocoDB tables are grouped by bounded context. Prefer folder boundaries:

```text
src/
  domains/
    cv/
    services/
    blog/
    contact/
    settings/
  ui/                 # pragmatic atomic components
    atoms/
    molecules/
    organisms/
    templates/
  app/                # Next.js routes only
  server/             # Hey API client wrapper, env, revalidate helpers
  generated/          # openapi-ts output (committed)
```

| Domain | Responsibility |
|---|---|
| **cv** | Profile, experience, highlights, projects, education, skills, languages, social links |
| **services** | Service categories & offerings; list + CTA (contact / Calendly) |
| **blog** | Posts, tags, categories, related posts; Markdown body |
| **contact** | Public form intake; Turnstile; persistence |
| **settings** | Feature flags & site-wide toggles |

Cross-domain imports go through small public APIs (`domains/<x>/index.ts`), not deep internals.

---

## 5. NocoDB schema (first cut)

> **Live inventory:** see [`docs/SCHEMA.md`](./SCHEMA.md) and `scripts/nocodb/.table-ids.json`.  
> Bootstrap: `npm run nocodb:schema` · Seed: `npm run nocodb:seed` (requires `.env.local`).

Locale model: **option B** — parent (or shared identity) + **locale variant rows** linked by relation. If FA variant missing → fall back to EN for CV/services copy. Blog posts are **locale-specific** (language key on post); EN list shows EN posts under `/en/blog`, FA under `/fa/blog`.

### settings

| Table | Notes |
|---|---|
| `SiteSettings` | Singleton-ish row: flags + public controls |

**Flags / fields (day one):**

- `show_blog`
- `show_services`
- `show_projects`
- `show_experience`
- `show_contact_form`
- `fa_locale_enabled`
- `maintenance_mode`
- `indexing_enabled` (global SEO kill switch; preview host always forced off)
- `show_hireable` / `show_day_rate` / `day_rate_amount` / `day_rate_currency` (hidden by default)
- `default_og_image` (attachment or URL)
- `calendly_url` (default `https://calendly.com/alighorbani/30min`)
- `public_email`, `public_phone`, `public_location` (Istanbul)
- `maintenance_message_en` / link to locale rows if preferred

### cv

| Table | Purpose |
|---|---|
| `Profile` | Name, headline, summary, avatar, hireable mirrors if needed |
| `ProfileLocale` | Localized headline/summary (`locale`: `en` \| `fa`) |
| `Experience` | Company, dates, location, URLs, sort |
| `ExperienceLocale` | Title, summary |
| `ExperienceHighlight` | Bullet + locale (or highlight locale child) |
| `Project` | Links, tech, dates, sort |
| `ProjectLocale` | Title, description |
| `Education` | School, dates |
| `EducationLocale` | Degree, field, details |
| `Skill` | Name, level, group/category, sort |
| `Language` | Name, proficiency, level |
| `SocialLink` | Label, URL, sort |

Seed from `cv.yaml` once, verify, then remove `cv.yaml` from the repo (or archive only with explicit approval).

Public contacts (site):

- Email: `ali.ghorbani.tr@gmail.com`
- Phone: `+989143252762`
- Location preference: **Istanbul**
- Fix public copy: **Serverless** (not “Severless”)

### services

Seed from `service-propose.md` positioning.

| Table | Purpose |
|---|---|
| `ServiceCategory` | e.g. Product Development, Consulting, Perf/Infra, AI, Partnerships |
| `ServiceCategoryLocale` | Title, short description |
| `Service` | Category FK, sort, active, CTA type (`contact` \| `calendly` \| `both`) |
| `ServiceLocale` | Title, summary, bullets (Markdown or linked `ServiceBulletLocale`) |

v1 UX: **list only** + CTA to contact form and/or Calendly. No service detail pages required initially.

### blog

| Table | Purpose |
|---|---|
| `BlogPost` | `slug`, `locale` (`en`\|`fa`), status (`draft`\|`published`), published_at, OG image, SEO title/description |
| `BlogPostBody` | Markdown body (or Markdown field on `BlogPost`) |
| `BlogTag` / `BlogTagLocale` | Tags |
| `BlogCategory` / `BlogCategoryLocale` | Categories |
| `BlogPostTag` | M2M |
| `BlogPostRelated` | Manual related posts |

v1 features: drafts, tags/categories, OG image, related posts, RSS, full SEO metadata.

Routes:

- `/en/blog`, `/fa/blog`
- `/en/blog/[slug]`, `/fa/blog/[slug]`

### contact

| Table | Purpose |
|---|---|
| `ContactMessage` | `name`, `email` (or phone — keep simple: contact channel + message), `message`, `turnstile_ok`, `ip_hash` (optional), `created_at`, `status` |

Form fields (v1): **contact** (email or phone) + **message** (+ name if useful for calling — prefer `name` + `contact` + `message`). Turnstile required.

### Destructive schema ops

- **Create/edit** tables & columns via NocoDB MCP: allowed.
- **Delete** tables/columns: **ask user confirmation**.
- **Rename**: allowed without confirm unless it causes data loss.

After any schema change that affects OpenAPI: regenerate Hey API SDK locally and commit (see §7).

**Webhooks:** create only after tables exist (user or agent with confirmation of URLs/secrets).

---

## 6. Rendering & caching

- Default: **SSG/ISR** for CV, services, blog lists/posts.
- OpenNext: configure **incremental cache** (KV; R2 if needed) + **tag cache** for on-demand revalidation.
- Time-based revalidate **and** NocoDB webhook-driven revalidation.
- Contact + revalidate routes: dynamic, no public caching of POST.

Preview host (`preview.qrbni.dev`): full **SEO off** — `noindex, nofollow`, robots disallow, no AI training hints as applicable, do not submit sitemap for preview.

---

## 7. Hey API / OpenAPI

**Decision (2026-07-31):** use live NocoDB **v2 base swagger**  
`GET /api/v2/meta/bases/{baseId}/swagger.json` → `openapi/nocodb-cv.openapi.json` → Hey API → `src/generated/nocodb`.  
Run `npm run nocodb:sdk` after schema changes. Fallback: `META_OPENAPI=1` Meta-derived generator.

Also available (not default): v1 project swagger (230 paths) and v3 data swagger — we stick to **v2** to match `/api/v2/tables/{id}/records`.

1. Live v2 base swagger (current; requires PAT `swaggerJson`).
2. Meta-derived OpenAPI fallback if swagger is forbidden again.
3. Config: `@hey-api/openapi-ts` with TypeScript + SDK + client-fetch (**no** React Query plugin).
4. **Generate locally only.** Commit OpenAPI + `src/generated/nocodb`. CI must **not** regenerate.
5. Server wrapper: `src/server/nocodb.ts` sets `baseUrl` + `auth()` → `xc-token`. Never import generated client from Client Components.

---

## 8. i18n & SEO

### Routing

- `/` → redirect `/en`
- All public pages under `/en/...` and `/fa/...`
- `lang` + `dir="rtl"` on FA documents

### SEO posture

Primary: **personal brand (Ali Ghorbani)** + secondary service intent (skills / consulting keywords).

Implement:

- Next.js Metadata API per locale (title, description, OG, Twitter)
- `alternates.languages` / hreflang between EN↔FA where equivalents exist
- Canonical per locale URL
- `sitemap.xml` + `robots.txt` (honor `indexing_enabled` + preview overrides)
- JSON-LD: `Person`, services/`OfferCatalog` or `ProfessionalService`, `BlogPosting`, `BreadcrumbList`
- Markdown blog rendering with sensible heading hygiene
- Placeholder favicon + default OG until real assets replace them
- Privacy copy lives on contact as an expandable section (`#privacy`); `/privacy` redirects there

Apex only: no `www` site (redirect `www` → apex at DNS/CF if needed).

Calendly CTA: `https://calendly.com/alighorbani/30min` (overridable via Settings).

---

## 9. Turnstile

Authoritative integration notes live in repo `turnstile.md` (Cloudflare Spin). Hard rules:

- Do **not** create another widget; one already exists.
- Do **not** call Cloudflare API to manage Turnstile widgets unless the user explicitly asks.
- Site key: env `TURNSTILE_SITE_KEY` — inject from **server** into the contact form in production (do not rely on a baked client bundle secret; site key is public but still prefer server-provided config).
- Secret: prefer env name `TURNSTILE_SECRET` (Spin canonical). If only `TURNSTILE_SECRET_KEY` is set, read that as fallback in code — **never** hard-code.
- Siteverify: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret`, `response`, `remoteip`; require `success === true` (fail closed).
- Widget marker: `data-action="turnstile-spin-v2"` on every `cf-turnstile` element.

---

## 10. Secrets & config

**Never paste secrets into chat or commit them.**

| Name | GitHub | Cloudflare Worker | `.env.local` |
|---|---|---|---|
| `CLOUDFLARE_API_TOKEN` | secret | — (CI deploy) | optional local wrangler |
| `CLOUDFLARE_ACCOUNT_ID` | secret | — | optional |
| `NOCODB_BASE_URL` | **variable** | var/secret as needed | yes |
| `NOCODB_API_TOKEN` | secret | **secret** | yes |
| `TURNSTILE_SITE_KEY` | secret | var OK (non-sensitive) | yes |
| `TURNSTILE_SECRET` / `TURNSTILE_SECRET_KEY` | secret | **secret** | yes |
| `REVALIDATE_SECRET` | secret | **secret** | yes |

`REVALIDATE_SECRET`: **self-generated** (`openssl rand -hex 32`), not issued by NocoDB. Paste the same value into NocoDB webhook URL/header after tables exist.

---

## 11. Git & deploy

### Branches

- `main` — integration branch; deploys to **`preview.qrbni.dev`**
- `feat/*` — **required** for parallel agent work; merge to `main` via PR (or explicit merge)
- Production: **git tags only** (e.g. `v1.0.0`) → deploy to **`qrbni.dev`**

### Agent commit policy

- Agents **auto-commit** on the active branch after a coherent unit of work.
- **Conventional Commits**: `feat|fix|chore|docs|refactor|test|ci|style(scope): message`
- Scopes examples: `cv`, `blog`, `services`, `contact`, `settings`, `sdk`, `ci`, `i18n`, `ui`
- Do not commit `.env*`, tokens, or generated secrets.
- SDK regen after schema change: `chore(sdk): regenerate NocoDB client`

### CI (GitHub Actions)

Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

- `main` push → OpenNext build → `opennextjs-cloudflare deploy` → **`preview.qrbni.dev`** (Worker `qrbni-preview`, top-level wrangler config)
- tag `v*` → `--env production` → **`qrbni.dev`** (Worker `qrbni`)
- CI sanitizes CF credentials, preflights `GET /accounts/{id}/workers/scripts`, retries deploy on transient API failures (e.g. HTML 522)
- After deploy, CI syncs app secrets onto the Worker via `wrangler secret bulk`
- Build uses committed SDK (CI must **not** regenerate)
- Node 22 (`.nvmrc`)

**GitHub repository configuration (required before first green deploy):**

| Kind | Name |
|---|---|
| secret | `CLOUDFLARE_API_TOKEN` (Workers edit + account; zone/DNS if attaching custom domains) |
| secret | `CLOUDFLARE_ACCOUNT_ID` |
| secret | `NOCODB_API_TOKEN` |
| secret | `TURNSTILE_SITE_KEY` |
| secret | `TURNSTILE_SECRET` |
| secret | `REVALIDATE_SECRET` |
| variable | `NOCODB_BASE_URL` (optional; defaults to `https://app.nocodb.com`) |

Local mirrors: `npm run deploy:preview` / `npm run deploy:production` (needs Wrangler auth + same env as `.env.local`).

**DNS:** `qrbni.dev` zone on Cloudflare; custom domains are declared in `wrangler.jsonc` (`env.preview` / `env.production` routes). First attach may require the zone to already exist in the same account.

### Cloudflare infra (day one)

- Worker + custom domains: apex + preview subdomain (`wrangler.jsonc` envs)
- KV (and R2 if chosen) for OpenNext ISR / tag cache — deferred until revalidation at scale
- Web Analytics enabled
- Turnstile widget already provisioned

---

## 12. UI / Impeccable

- Mode for portfolio/home: **Experience** (artifact-led); marketing services sections may lean **Persuade**.
- Run Impeccable `init` → `PRODUCT.md` / design world; Impeccable **owns** visual decisions.
- Engineering agents: implement tokens/components; do not “fix” aesthetics against Impeccable without a design pass.
- Pragmatic Atomic Design — clean folders, not dogma.

---

## 13. Agent operating rules

1. Read this file first.
2. Prefer Context7 for library docs; Cloudflare MCP for CF platform; NocoDB MCP for schema/data.
3. Parallelism only on `feat/*` branches.
4. After NocoDB schema changes → local codegen → commit SDK.
5. Ask before deleting NocoDB tables/columns or destructive data ops.
6. Contact form: Turnstile before NocoDB write.
7. No admin UI — NocoDB is the CMS.
8. Think forward (blog, i18n, ISR, flags) but ship vertical slices.
9. Placeholders OK for images/favicon/OG until replaced.
10. When uncertain about product copy facts, prefer NocoDB/settings and `cv.yaml` seed over inventing biography claims.

---

## 14. Seed & cleanup

1. Create tables/columns in NocoDB (MCP).
2. Import `cv.yaml` + services from `service-propose.md`.
3. Verify on preview.
4. Remove seed files from repo when user confirms (`cv.yaml`, optionally archive `service-propose.md`).
5. Configure NocoDB webhooks → revalidate endpoints.
6. First production tag when ready.

---

## 15. Open decisions / deferred

- Exact OpenAPI source after first swagger fetch bake-off (base-specific vs v3 generic).
- Cloudflare Email Sending (optional notify) — not v1.
- Whether contact stores email vs phone vs freeform “contact” field — implement `name` + `contact` + `message`.

---

## Document history

- 2026-07-31 — Initial architecture from product discovery; binding for agents.
