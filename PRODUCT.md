# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** founders and businesses evaluating Ali Ghorbani as a senior technical partner (custom product work, architecture/consulting, retainers). They arrive comparing outcomes, trust, and fit—not shopping for cheap ticket hours.

**Secondary:** recruiters and hiring managers scanning experience, stack depth, and credibility. The site must remain CV-legible, but conversion and narrative optimize for the primary audience first.

## Product Purpose

Public personal site for **Ali Ghorbani** (`qrbni.dev`): brand, CV/experience, outcome-led services, and a technical blog—so visitors can understand who he is, what he delivers, and book a conversation.

Success means a qualified visitor books a **Calendly 30‑minute** meeting (or leaves a clear contact path as fallback), with content stay trustworthy in EN and FA.

## Positioning

Not a generic freelance “full-stack developer for hire.” Position as a **senior technical partner** who helps startups and businesses **design, build, and scale reliable web products**—architecture, delivery, AI integration, and long-term partnership—not ticket implementation alone.

## Operating Context

- Visitors browse on mobile and desktop; EN default, FA with RTL when enabled.
- Content is edited in **NocoDB** (no in-app admin); the site reads via server-only APIs.
- Public contact: email, phone, Istanbul location; Calendly for meetings; contact form for async messages (Turnstile-protected).
- Hireable / day-rate visibility is controlled by settings and **hidden by default**.

## Capabilities and Constraints

**In scope:** marketing CV/home, services list + CTAs, blog (Markdown), contact form, privacy, EN/FA routing, feature flags (blog, services, maintenance, FA locale, indexing, etc.).

**Out of scope (v1):** in-site CMS/admin, client-side NocoDB tokens, React Query against NocoDB, production deploys from untagged `main`.

**Stack (existing):** Next.js App Router, React, Tailwind, Cloudflare Workers + OpenNext, Hey API server SDK, NocoDB.

**Undecided / deferred:** outbound email notify on contact (NocoDB-only for now); FA translations of all content (EN seeded, FA fallback).

## Brand Commitments

- Name: **Ali Ghorbani**
- Domain: **qrbni.dev** (apex); preview **preview.qrbni.dev**
- Public location: **Istanbul**
- Public contacts: `ali.ghorbani.tr@gmail.com`, `+989143252762`
- Meeting CTA: `https://calendly.com/alighorbani/30min`
- Voice: senior, outcome-oriented, clear; avoid “Severless” typo—use **Serverless**
- No fabricated testimonials, customers, or metrics beyond sourced CV/NocoDB content

## Evidence on Hand

- NocoDB CV base (seeded from `cv.yaml`): profile, experience, projects, education, skills, languages
- Services catalog seeded from `service-propose.md` positioning
- Placeholder draft blog post; real posts to be authored in NocoDB
- Avatar URLs available from GitHub/Twine sources in seed data
- **Do not invent** recommendations, logos, case-study metrics, or press

## Product Principles

1. **Partner, not tickets** — every services and home narrative reinforces outcome ownership.
2. **Calendly first** — primary conversion is a 30‑minute meeting; contact form supports, doesn’t compete.
3. **Truthful evidence** — only show experience, projects, and claims backed by NocoDB/seed sources. Soften unverified numeric metrics to qualitative outcomes until confirmed.
4. **Bilingual without compromise** — FA is a first-class locale (RTL); missing FA falls back to EN. Prefer authored FA locale rows over fallback.
5. **CMS-operated** — editors change NocoDB; the site stays a fast, cacheable public surface. Source bilingual copy in `cv.yaml` + `content/services.yaml`, sync with `npm run nocodb:sync-content`.
6. **Dual tone** — Home/Services speak as technical partner; Experience keeps CV-literal job titles for recruiters, with outcome-led highlights.

## Accessibility & Inclusion

**WCAG 2.2 AA** is a hard target for public pages (semantic structure, contrast, keyboard, forms, focus, language/dir). EN+FA and RTL must remain accessible, not decorative afterthoughts.
