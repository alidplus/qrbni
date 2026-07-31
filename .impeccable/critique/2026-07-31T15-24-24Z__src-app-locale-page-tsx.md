---
target: home Split Pin (src/app/[locale]/page.tsx)
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-07-31T15-24-24Z
slug: src-app-locale-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Mid-column Sections nav hard-codes Experience as red+underlined “current” on Home; Book 30 min gives no “opens externally” cue |
| 2 | Match System / Real World | 3 | Pin-up / title-block metaphor fits “partnership as rigorous review”; occasional plate jargon (“Scale · Human”) needs a beat |
| 3 | User Control and Freedom | 3 | Home, EN/FA, section links, secondary Contact provide exits; Calendly `target="_blank"` keeps the wall |
| 4 | Consistency and Standards | 2 | Red underline means emphasis, active locale, “active” section, *and* Contact—same signal, different meanings; experience PinSheets look interactive but are not |
| 5 | Error Prevention | 2 | Misleading Experience active state; FA locale still shows EN experience summaries; plate meta stays English |
| 6 | Recognition Rather Than Recall | 3 | Primary actions labeled; companies + titles visible; recruiter must still find View experience → for full CV |
| 7 | Flexibility and Efficiency | n/a | Experience (+ Persuade CTA) portfolio home; expert accelerators not expected |
| 8 | Aesthetic and Minimalist Design | 3 | Strong purposeful world; red marks + dual Contact + three résumé strips add noise that softens the Persuade peak |
| 9 | Error Recovery | 2 | Few on-page error states; outbound Calendly failure has no on-wall recovery; wrong-locale content is not diagnosed |
| 10 | Help and Documentation | n/a | Self-explanatory Experience/Persuade surface; docs would be wrong mode |
| **Total** | | **20/32** | **Acceptable (~63%)** |

## Design Specificity Verdict

**LLM assessment**: This home is clearly authored for **Redline Pin-up / Split Pin**, not a category-swap freelance template. Sticky left PinSheet with PushPins, masking Tape, FigLabel (“Fig. 01 · Portrait assembly”), PortraitPlate construction ticks, RegistrationMarks, Crosshair, TitleBlockMeta, Barlow Condensed title-block type, paper ground wash, and red grease-pencil underlines on real product words form a coherent architecture-critique wall. Swapping this for an unrelated SaaS landing would break the metaphor. Specificity is diluted—not erased—where red underlines also mark nav “active” and links, where Contact appears twice, and where Selected experience strips read as generic résumé cards (“Full Stack Engineer”) rather than critique-wall evidence. Craft-no-claims correctly strips the mock’s invented handwritten slogans; the live surface keeps the composition but is thinner in craft density than the mock’s annotated peak.

**Deterministic scan**: `detect.mjs --json` on six markup targets (`HomeSplitPin.tsx`, `[locale]/page.tsx`, `SiteHeader.tsx`, `BookCta.tsx`, `PinSheet.tsx`, `PortraitPlate.tsx`) exited **0** with **0 findings** (`[]`). No rule hits. No false positives to classify. globals.css not scanned (prefer markup; empty markup result made CSS pass unnecessary).

**Visual overlays**: No reliable user-visible overlay. Browser MCP/tooling unavailable in Assessment B; fallback signal **CLI-only**. Live preview was inspected by Assessment A via screenshots (`preview.qrbni.dev/en`, `/fa`, mobile) without inject overlay.

## Overall Impression

Split Pin is a distinctive, on-world home: the portrait assembly sheet is the memorable artifact, and the solid red **Book 30 min** block is the right Persuade instrument when visible. The implementation is more disciplined than the mock (no fake slogans) but flatter at the end—especially where résumé strips and overused redline marks soften trust and hierarchy. Fix the false Experience active state, restore Calendly into the mobile first viewport, and give red a single job; then the wall will feel as precise as it looks.

## What's Working

1. **Split Pin composition is memorable and on-brief** — sticky portrait PinSheet (pins, tape, Fig. 01, PortraitPlate, title block) beside a reading column is a real visual world, not a hero stock layout.
2. **Primary conversion is correctly weighted** — solid redline BookCta (“Book 30 min” / “رزرو ۳۰ دقیقه”) with calendar mark is the clearest interactive object when it is in view.
3. **Craft-no-claims discipline holds** — no invented slogans, fake metrics, or doodle claims; redline sits on real product words (`design` / `build` / `scale`, architecture / delivery). Detector agrees: no anti-pattern markup hits.

## Priority Issues

1. **[P1] False “current” on Experience in Sections nav**
   - **What**: Home mid-column nav always styles Experience as red + underline (active), even though the route is `/[locale]`.
   - **Why it matters**: Breaks location trust on a surface that sells precision; founders may think Experience is “here” already.
   - **Fix**: Reserve red underline for true active route (or none on Home); treat Experience as a peer link like Services/Blog.
   - **Suggested command**: `$impeccable polish` HomeSplitPin sections nav active state

2. **[P1] Mobile first viewport buries Book 30 min**
   - **What**: On ~390px, portrait assembly fills the screen; pitch starts at the bottom edge; BookCta is below fold.
   - **Why it matters**: Mode is Experience + Persuade CTA; Calendly-first fails if the action isn’t in the first decision frame.
   - **Fix**: Mobile stack: pitch + Book (+ Contact) first or immediately after a compressed plate; keep full assembly as sticky/secondary, not the only above-fold content.
   - **Suggested command**: `$impeccable adapt` HomeSplitPin mobile first viewport for Calendly

3. **[P1] Redline semantic overload**
   - **What**: Same red underline/mark language on RedlineEm, support underlines, Technical Partner, Contact link, false-active Experience, plus pins/diamond/slashes.
   - **Why it matters**: Founders can’t trust red as “act here”; Persuade signal dilutes.
   - **Fix**: One job for red interactive (CTA + true active + locale); atmosphere marks use thinner/shorter ticks or ink-only emphasis on body.
   - **Suggested command**: `$impeccable quieter` HomeSplitPin redline roles

4. **[P2] Selected experience undercuts “Technical Partner”**
   - **What**: Strips lead with company + Full Stack Engineer/Developer titles, 2-line summaries, non-clickable PinSheets that look like cards.
   - **Why it matters**: End of journey contradicts pitch (“Not ticket hours”); recruiters click sheets expecting detail and get none.
   - **Fix**: Prefer partner-relevant framing (scope/outcomes from real NocoDB fields only); make whole strip a link to `/experience` (or `#id`), or mute card affordance; avoid inventing metrics.
   - **Suggested command**: `$impeccable clarify` Selected experience strips for partner narrative

5. **[P2] Dual Contact paths compete with Calendly-first**
   - **What**: Contact text link beside BookCta *and* Contact again in section nav.
   - **Why it matters**: Splits the primary decision; PRODUCT principle is Calendly first, form as fallback.
   - **Fix**: Keep one secondary Contact near Book; drop Contact from section nav *or* demote the inline link to the nav only.
   - **Suggested command**: `$impeccable distill` HomeSplitPin CTA cluster

## Persona Red Flags

**Founder evaluating technical partner** (project audience): Strong atmosphere and clear Book 30 min, then IC job titles in Selected experience—credibility dip at the proof moment. Red noise makes it unclear whether underlined words are claims or controls. Mobile: must scroll past Fig. 01 before the ask; high bounce risk. No on-wall cue what the 30 minutes is for.

**Recruiter / hiring manager scanning CV** (Jordan-adjacent first-timer on portfolio): Experience PinSheets look tappable; they are not—dead-end affordance. Summaries `line-clamp-2` hide stack depth; skills never appear on Home. Path to full timeline is a small View experience → only. “Full Stack” framing may bin Ali as commodity IC vs partner.

**Distracted mobile user (Casey)**: First viewport is almost entirely the portrait PinSheet; Book 30 min sits below the fold—Persuade action fails the thumb-zone / first-decision test. FA/RTL: Split flips correctly, but experience content and TitleBlockMeta stay English inside FA chrome.

## Minor Observations

- Mock’s handwritten CTA callout and portrait annotations are gone (correct under craft-no-claims); replace density with material craft (tape grain, settle, plate), not fake slogans.
- Decorative Crosshair appears twice on the portrait sheet—once is enough.
- Header “Istanbul · Partner” is `aria-hidden`—sighted users see meta that assistive tech skips.
- Experience red `/` marks read as status/annotation without meaning.
- Desktop sticky portrait works; long right-column scroll can leave a static “museum plate” while proof scrolls away—acceptable for Experience, slightly lonely for Persuade.
- BookCta focus ring is good; solid red on paper should stay contrast-checked (audit territory).
- Cognitive load: ~2–3 checklist failures (single focus on mobile, visual hierarchy weak from red overload, minimal choices borderline from dual Contact). No decision point strictly >4 options.

## Questions to Consider

1. If red can only mean one thing on this wall, should it mean **act** (Book / locale / true route) or **critique** (emphasis on words)—and which loses?
2. Should the mobile first frame be the partner ask, with Fig. 01 as the artifact you keep, not the gate you clear?
3. Do three “Full Stack” scraps prove partnership, or should Selected experience show only roles/evidence that survive the “not ticket hours” line?
4. Is Contact allowed to sit shoulder-to-shoulder with Book, or does that violate Calendly-first the moment it appears twice?
5. After stripping the mock’s handwritten peak, what *true* craft moment replaces that emotional spike without inventing claims?
