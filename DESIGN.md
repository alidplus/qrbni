# Design

<!-- impeccable:design-schema 1 -->

## World

**Redline Pin-up** — architecture critique wall: plotter paper, title-block grotesk, masking tape, red grease-pencil marks, stamped ACTION. Partnership as rigorous review.

**Home composition:** Split Pin (`comp-b`) — tall taped name sheet + reading column with Calendly primary; experience as stacked pin sheets.

## Palette

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F7F4EF` | Page ground / sheets |
| `--ink` | `#111111` | Primary text / rules |
| `--redline` | `#C1121F` | Marks, primary CTA, active locale |
| `--slate` | `#5C6B73` | Secondary text (tinted from scene, not gray-on-cream accident) |
| `--tape` | `#E8E2D9` | Masking tape |

Light scene: desk / pin-up wall under indoor ambient light. Not dark-mode default.

## Typography

- **Display (EN):** Barlow Condensed — title blocks, name, CTAs, section labels
- **Body (EN):** Source Sans 3 — supporting copy
- **FA (`lang="fa"`):** [Vazirmatn](https://fonts.google.com/specimen/Vazirmatn) for both body and display (RTL-friendly)
- No eyebrow kickers. Headings carry weight alone.

## Components

- **Pin sheet:** paper surface + soft offset shadow + optional tape chips + registration corners
- **Book CTA:** solid redline block, uppercase display tracking — primary conversion to Calendly
- **Header:** thin title-block rule; `qrbni.dev` + EN/FA
- Avoid card grids as page structure; experience items are individual pinned sheets

## Motion

One settle: pin sheets ease into place (`pin-settle`). Respect `prefers-reduced-motion`.

## Accessibility

WCAG 2.2 AA target. Red CTA on paper must keep contrast; body text uses ink/slate on paper. Focus rings on CTA use redline outline offset. `lang`/`dir` from locale.

## Surfaces

| Surface | Mode | Notes |
|---|---|---|
| Home `/[locale]` | Experience (+ Persuade CTA) | Split Pin |
| Other routes | inherit world | Apply SiteHeader + paper ground progressively |

## Seeds

Direction seed `f9889c92` · chosen `challenger-pinup` · composition `comp-b`.
