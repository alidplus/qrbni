# NocoDB schema (CV base)

**Base ID:** `p4cutoefjsz0z2t`  
**Relations:** Number `*Id` foreign keys (API-stable). Native Links can be added later in the UI.  
**Locale model:** variant rows with `Locale` = `en` | `fa`; site falls back to EN when FA missing. Blog posts are locale-specific rows.

## Bootstrap / seed

```bash
nvm use 22
set -a && source .env.local && set +a
node scripts/nocodb/bootstrap-schema.mjs   # idempotent create
node scripts/nocodb/seed.mjs               # skips if SiteSettings already has rows
```

Table IDs are written to `scripts/nocodb/.table-ids.json` (safe to commit).

## Domains → tables

| Domain | Tables |
|---|---|
| settings | `SiteSettings` |
| cv | `Profile`, `ProfileLocale`, `Experience`, `ExperienceLocale`, `ExperienceHighlight`, `Project`, `ProjectLocale`, `Education`, `EducationLocale`, `Skill`, `Language`, `SocialLink` |
| services | `ServiceCategory`, `ServiceCategoryLocale`, `Service`, `ServiceLocale` |
| blog | `BlogTag`, `BlogTagLocale`, `BlogCategory`, `BlogCategoryLocale`, `BlogPost` |
| contact | `ContactMessage` |

## Hey API SDK

**Primary:** fetch live NocoDB **v2 base swagger** (requires PAT `swaggerJson`), then Hey API:

```bash
set -a && source .env.local && set +a
npm run nocodb:sdk   # = nocodb:openapi + codegen
```

- Spec: `openapi/nocodb-cv.openapi.json` (committed)
- Client: `src/generated/nocodb/` (committed)
- Server wrapper: `src/server/nocodb.ts` (token via `xc-token`, never browser)
- SDK ops look like `experienceDbTableRowList`, `sitesettingsDbTableRowList`, …

**Fallback** (if swagger forbidden again): `META_OPENAPI=1 npm run nocodb:openapi`  
→ Meta-derived spec via `scripts/nocodb/generate-openapi-from-meta.mjs`

After any table/column change: `npm run nocodb:sdk` and commit both the OpenAPI file and generated client.

## Notes

- Seeded EN content from `cv.yaml` + services catalog; FA translations can be added in NocoDB.
- Headline typo fixed to **Serverless** on seed.
- Hireable / day-rate visibility flags default **off**.
- One draft blog post: `hello-qrbni` (EN).
- Revalidate webhooks: `SITE_URL=https://preview.qrbni.dev npm run nocodb:webhooks` (see `docs/ARCHITECTURE.md`).
