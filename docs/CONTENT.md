# Content voice & CMS sync

## Voice

| Surface | Tone | Notes |
|---|---|---|
| Home, Services | Partner | Outcomes, ownership, Calendly-first |
| Experience | CV-literal titles | Keep real titles; highlights are outcome-led |
| Profile summary | Partner | Stack keywords OK; no ticket-hours framing |

## Metrics

Do not publish approximate percentages or invented precision. Prefer qualitative outcomes until verified. Source caveats live in `cv.yaml` `meta.caveats`.

## Sources of truth

- CV / experience / projects / education / profile: [`cv.yaml`](../cv.yaml) (fields use `{ en, fa }` where localized)
- Services catalog: [`content/services.yaml`](../content/services.yaml)
- Live CMS: NocoDB locale tables (`ProfileLocale`, `ExperienceLocale`, `ExperienceHighlight`, `ServiceLocale`, …)

## Commands

```bash
# Fresh base only (aborts if already seeded)
set -a && source .env.local && set +a && npm run nocodb:seed

# Update EN + create missing FA on an existing base
set -a && source .env.local && set +a && npm run nocodb:sync-content
```

After sync on production content, call `/api/revalidate` with tags `cv` and `services` (see `src/server/revalidate-map.ts`).
