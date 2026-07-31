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

## Notes

- Seeded EN content from `cv.yaml` + services catalog; FA translations can be added in NocoDB.
- Headline typo fixed to **Serverless** on seed.
- Hireable / day-rate visibility flags default **off**.
- One draft blog post: `hello-qrbni` (EN).
- After schema changes: regenerate Hey API SDK locally and commit (`npm run codegen`).
- Revalidate webhooks: configure after confirming table IDs (see architecture).
