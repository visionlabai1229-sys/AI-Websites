# DESIGN.md — VisionLab AI Website Design System

Extracted from the live `index.html` CSS on 2026-09-15, as Step 2 of `plans/2026-09-15-premium-website-upgrade.md`. This is a reference doc, not a new design — it documents what already exists so the premium upgrade (and any future edit) stays internally consistent instead of re-deriving the system from scratch each time.

---

## Color

| Token | Value | Usage |
| --- | --- | --- |
| `--bg` | `#04060E` | Page background — near-black navy |
| `--fg` | `#fff` | Primary text |
| `--teal` | `#00C2D4` | Primary brand accent — links, active states, glows, CTAs |
| `--teal2` | `#2AE0F0` | Teal highlight variant (gradients, hero headline glow) |
| `--orange` | `#F08C00` | Secondary brand accent — labels, alternate CTAs, stat highlights |
| `--orange2` | `#FFB200` | Orange highlight variant |
| `--muted` | `rgba(255,255,255,.52)` | Body copy on dark backgrounds |
| `--muted2` | `rgba(255,255,255,.28)` | Tertiary text — stat labels, disabled list items |
| `--border` | `rgba(255,255,255,.06)` | Hairline dividers |
| `--card` | `rgba(255,255,255,.028)` | Base card fill (very faint — real card fill comes from gradients, see Depth) |

Teal = primary/trust actions. Orange = attention/energy accents (section labels, stat call-outs). Never mixed as a single gradient without intent — used as complementary poles (e.g. `.rule` gradient runs teal→orange).

---

## Typography

- **Sans (body/UI):** `'Space Grotesk'`, weights 300–700, loaded via Google Fonts.
- **Display/Serif (accent only):** `'Instrument Serif'`, italic variant used for headline emphasis (e.g. hero's second line "More Appointments Booked." reads in serif italic) and for ROI stat numbers (`.roi-num`). Never used for body copy — accent/display use only, per the "never same font for heading and body" guardrail.
- **Heading scale:**
  - `.sec-h2` / `.sec-h2-c`: `clamp(30px,3.8vw,56px)`, weight 600, line-height 1.08, letter-spacing `-.03em`
  - `.sec-h2-xl`: `clamp(38px,5.8vw,82px)`, weight 600, line-height 1.05, letter-spacing `-.035em` (hero-scale)
  - `.stat-num`: `clamp(28px,3.4vw,46px)`, weight 700, letter-spacing `-.03em`
  - `.pc-price`: `clamp(28px,3.2vw,42px)`, weight 700, letter-spacing `-.03em`
- **Body:** `.body-sm` — 15px, line-height 1.74, color `var(--muted)`. Generous line-height on body confirmed throughout.
- **Labels/eyebrows:** `.sec-label`, `.card-label`, `.pc-tier` — 10–10.5px, weight 700, letter-spacing `.14em`–`.2em`, uppercase, colored teal or orange, `.sec-label` additionally has a soft text-shadow glow.
- **Tight tracking on large headings, loose tracking (wide) on small uppercase labels** — the scale is deliberately bimodal, not a single tracking value applied everywhere.

---

## Spacing

- Section padding is mostly `clamp()`-driven or fixed pairs: `padding:44px 60px` (most content sections), `padding:0 clamp(32px,6vw,90px)` (sections that need edge-to-edge canvas room), `padding:100px 60px 44px` (pricing, extra top clearance for the ROI bar).
- Card internal padding: `.gcard` → `26px 24px`; `.pc` (pricing card) → `28px 22px 22px`.
- Card gap conventions aren't fixed-token yet (grid gaps vary per section) — **note for the upgrade spec:** if new grids are added, pick one gap scale (12/16/24/32px) rather than an ad hoc value.
- Mobile breakpoint: single query at `max-width:640px` — section padding drops to `40px 20px`, nav collapses to hamburger, grids collapse to `1fr`.

---

## Shadows & Depth

Three-tier layering system already in use:

1. **Base surface** — page background (`--bg`) + fixed canvas/grain layers (z-index 0–2), no shadow.
2. **Elevated surface** — `.gcard` / `.pc`: `box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)`, `backdrop-filter: blur(12px)`. Subtle radial gradient overlay on hover (`::before`, opacity 0→1) tinted teal or orange depending on card variant.
3. **Floating/interactive surface** — hover states push shadows further out and add a color-tinted glow: `.gcard:hover` → `0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(0,194,212,.1)`; `.pc.active` (selected pricing tier) → `0 24px 64px rgba(0,0,0,.5), 0 0 48px rgba(0,194,212,.2)`.

Buttons follow the same logic: `.btn-hero` uses a white gradient fill with a teal-tinted ambient shadow (`0 12px 40px rgba(0,194,212,.35)`) that intensifies on hover — the shadow color, not just size, does the "lift" work.

**Rule for the upgrade:** any new elevated element должен follow base→elevated→floating, with hover always intensifying blur-radius + opacity of a *color-tinted* shadow, never a flat gray shadow.

---

## Motion & Easing

Two named cubic-bezier curves cover nearly all motion in the site:

- `--sp: cubic-bezier(.2,.8,.2,1)` — snappy, used for quick UI feedback (underlines, button fills, hover scale).
- `--sp2: cubic-bezier(.16,1,.3,1)` — slower, floatier "arrival" ease, used for scroll-entrance animations.

**Existing scroll-entrance system (`depth-enter`)** — already a genuinely premium mechanic, worth reusing/extending rather than replacing:
- Sections/elements start `opacity:0`, `translateZ(-120px) translateY(30px) scale(.92)`, `blur(6px)` — i.e. they start "far away and out of focus" — and animate to full clarity on scroll-into-view via an `.arrived` class toggle (JS-driven, presumably `IntersectionObserver`).
- Staggered children via `data-d="1"`–`data-d="6"` attributes, each adding `.08s` more delay (`.08s, .2s, .33s, .48s, .64s, .8s`) — creates a cascade rather than simultaneous pop-in.
- Directional variants `.de-l` / `.de-r` add horizontal origin (`translateX(±60px)`) for elements that should feel like they're entering from a side.
- Hero-specific `.hl` / `.hl.in` — same language, simpler (no Z-depth), for above-the-fold load-in.

**Ambient/looping motion:** `.hc` (service icon circles) float via a `5s ease-in-out infinite` keyframe with staggered negative delays per child, so a row of icons never moves in sync. `.si-dot` (scroll indicator) pulses similarly. Both are small, slow, and continuous — background texture, not attention-grabbing.

**Rule already enforced (and to keep enforcing):** only `transform`, `opacity`, and `filter` are animated — never `transition-all`, never animating `width`/`height`/`top`/`left` directly for motion (the one exception, `waveBar`'s `height` keyframe on a 2.5px-wide bar, is a deliberate micro-detail, not a layout-affecting animation).

---

## Component Recipes (for consistency when extending)

- **Glass card (`.gcard`):** gradient fill (`rgba(255,255,255,.05)→.02`) + 1px border (`rgba(255,255,255,.08)`) + `backdrop-filter:blur(12px)` + radial hover-tint + `translateY(-8px) scale(1.012)` lift on hover.
- **Pill button (`.btn`):** transparent fill, teal or orange 1px border, fill-wipe pseudo-element sliding in from the left on hover (`::before`, `translateX(-105%)→0`), arrow icon nudges on hover.
- **Hero CTA (`.btn-hero`):** solid white→gray gradient, no border, heaviest shadow treatment in the system (reserved for the single highest-priority action per section).
- **Pricing card (`.pc` / `.pc.active`):** same glass-card base, but the "active"/recommended tier gets a teal-tinted fill gradient instead of neutral, plus a floating badge pill (`.pc-badge`) using `translateX(-50%)` centering with a negative top offset to "hang" above the card edge.
- **Section label (`.sec-label`):** the smallest, highest-contrast text element in any section — uppercase, wide-tracked, orange, glowing — always precedes a heading, functions as the section's "eyebrow."

---

## What's Already Premium (don't regress)

- Font pairing (serif accent + geometric sans) — already correct, don't touch.
- Color-tinted shadows everywhere — already correct, extend the same formula to new elements.
- The `depth-enter` scroll system is more sophisticated than a typical AI-generated site's simple fade-in — it's a real asset. The upgrade should **extend this system** (e.g. add count-up numbers, more deliberate stagger choreography) rather than replace it with something generic.
- Brand color discipline (no default Tailwind blue/indigo anywhere) — confirmed throughout.

## Candidate Addition: Dedicated Micro-Label Typeface

Surfaced by the NovaAI motionsites.ai example (see `motionsites-technique-notes.md`): a third typographic voice, reserved exclusively for uppercase/wide-tracked micro-copy (`.sec-label`, `.card-label`, `.pc-tier`, `.stat-lbl`, `.roi-label`), distinct from both Space Grotesk (body/UI) and Instrument Serif (display accent). Currently these all use Space Grotesk at small size. A single monospace Google Font (candidates: Space Mono — pairs naturally with the existing "Space Grotesk" name; or JetBrains Mono / IBM Plex Mono) applied only to these micro-label elements would add one more layer of deliberate typographic craft without touching the existing pairing rule. Low-risk, single font-family swap on a small set of already-isolated CSS classes.

## What the Upgrade Spec Should Target

Per the plan's Step 4, the gap is less "wrong tokens" and more "restrained/safe application of a good system" — count-up stats, scroll-storytelling transitions between sections, and hover/interaction polish on secondary elements (nav, footer, testimonial) are the likely highest-leverage additions, to be confirmed against motionsites.ai technique notes (Step 3) before finalizing the spec.
