# Premium Upgrade Spec — VisionLab AI Website

Step 4 of `plans/2026-09-15-premium-website-upgrade.md` — the two-pass planning step. Written before any code changes to `index.html`. Reviewed section by section against `DESIGN.md` (existing tokens) and `motionsites-technique-notes.md` (harvested techniques). **This is the checkpoint to review before Step 5 implementation begins.**

---

## Architecture Constraint (read first)

VisionLab's site uses **mandatory scroll-snap**: `#scroller { scroll-snap-type: y mandatory }`, and every `<section>` is exactly `height:100vh`. Both motionsites.ai examples achieve their most dramatic effects (continuous scroll-scrubbed choreography, sticky-stacking cards) via the opposite architecture — a single tall container (`height: calc(100vh + Npx)`) with an inner `position: sticky` stage that stays pinned while raw scroll distance drives animation continuously.

**These two architectures don't mix without restructuring.** A true Mostar-style scroll-scrub or a true Jack-style sticky-stacking card group needs scroll room beyond 100vh to work — which breaks the one-section-per-viewport snap model every other section relies on.

**Decision for this pass:** keep the scroll-snap architecture untouched (per the plan's own Hard Rules — no structural changes) and apply only the techniques that are compatible with per-section, arrival-triggered animation (the existing `depth-enter` / `.hl` pattern). Where a technique's *full* version needs continuous scroll, an **adapted version** is specified instead — same visual idea, triggered on section-arrival rather than scroll-distance. True continuous scroll-scrub and sticky-stacking are noted as **explicit stretch options, not part of this pass**, in case Stephen wants to revisit the architecture question separately later.

---

## Priority Tiers

Per the plan's Open Question 3 (trust/conversion sections first). **Stephen confirmed full scope — all sections below are in this pass, P1 first for implementation order:**

- **P1 (do first):** Hero (s0), Pricing (s8), Testimonial (s9), About (s10), cross-cutting micro-label typeface
- **P2 (do next):** Product sections (s2–s5), Phase cards (s7), CTA+Footer (s11)
- **P3 (do last):** Services Overview (s1), Method intro (s6) — lowest marginal value, but included in this pass per Stephen's scope decision; kept deliberately light-touch since they're already well-served by existing motion
- **Not in this pass:** true continuous scroll-scrub, sticky-stacking cards (see Architecture Constraint) — still out of scope regardless of section priority, since this is an architecture decision, not a priority one

---

## Cross-Cutting Change (applies site-wide, not one section)

**Dedicated micro-label typeface.** Per the NovaAI example (see `motionsites-technique-notes.md`), add one monospace Google Font — recommend **Space Mono** (pairs naturally with the existing "Space Grotesk" name) — applied exclusively to the small uppercase/wide-tracked micro-copy classes: `.sec-label`, `.card-label`, `.pc-tier`, `.stat-lbl`, `.roi-label`. These currently render in Space Grotesk at small size; giving them their own typeface adds a third deliberate typographic voice (display serif / body sans / mono label) without touching the existing heading-body pairing rule in `DESIGN.md`.

This is a **single font-family swap on a small, already-isolated set of CSS classes** — low risk, applies consistently across every section that uses these classes (nearly all of them), and should be done once, early, rather than section-by-section. Treat as a P1 change alongside the hero/pricing/testimonial/about work, since it touches all of them anyway.

---

## Section-by-Section

### s0 — Hero

**Current:** 3D chrome-shine headline (already premium, don't touch), live badge, trigger-once `.hl` load-in, tech-stack marquee (constant-speed, already has a nice per-card 3D tilt-on-hover), stats row.

**Proposed changes:**
1. **Restrained pointer-parallax on the headline block.** Lerped mouse offset (technique #4/16), very small range (±4–6px translate, no rotation) — headline should feel subtly alive, not like it's tracking the cursor aggressively. B2B audience — keep it barely perceptible.
2. **Tie the tech marquee's scroll speed to a global scroll-velocity signal** (technique #3, adapted): track `scrollY` delta across the whole page via a lightweight passive listener, and briefly speed up the marquee's per-frame increment when the user is actively scrolling fast, decaying back to its resting 0.4px/frame speed when scrolling stops. Works fine under scroll-snap since scroll events still fire during snap transitions — no architecture change needed.

**Leave alone:** the chrome-text shine animation, the 3D-tilt marquee cards (`.tcard` mousemove tilt), the live badge pulse — all already premium per `DESIGN.md`.

**Rationale:** Hero is the single highest-trust section. Both additions are cheap, reversible, and keep the existing (already strong) visual language intact rather than replacing it.

---

### s1 — Services Overview

**Current:** 4 ambient-floating icon circles with staggered `depth-enter` entrance, centered heading/subcopy. Each icon's caption ("Voice Agent," "Retention," "AI Website," "Results") is hand-styled inline (10px, weight 700, `.14em` tracking, uppercase) rather than using the shared `.sec-label` class.

**Proposed changes:**
1. **Restrained magnetic-pull nudge on hover** (technique #16), layered on top of the existing `.hc:hover` scale — small, tasteful cursor-follow on the icon circles only, consistent with the same restrained treatment used on the About photo (s10).
2. **Fold the 4 icon captions into the cross-cutting micro-label typeface** change (they're functionally `.sec-label`-style text already, just not using the class) — small consistency cleanup that comes for free once the monospace label font is added.

**Rationale:** Already has staggered entrance + continuous ambient float, so kept light-touch — the goal here is consistency with the rest of the site's new micro-label voice, not new motion for its own sake.

---

### s2 — AI Voice Receptionist / s3 — Patient Retention / s4 — AI Website

**Current:** Alternating left/right split layout, `de-l`/`de-r` side-entrance stagger already implemented, each with its own canvas background (`cvVoice`/`cvRet`/`cvWeb`).

**Proposed changes:**
1. **Progressive blur/brightness focus cue on the canvas background during arrival** (technique #5, adapted): when a section's content is arriving (same `.arrived` class toggle already driving `depth-enter`), briefly defocus the canvas background (small blur + brightness dip, ~300–400ms) then resolve to full clarity as the text locks into its resting position — echoes Mostar's transition-blur technique without needing continuous scroll-scrub, since it's keyed to the existing arrival trigger.

**Leave alone:** the `de-l`/`de-r` stagger, the canvas backgrounds themselves (content, not motion — out of scope for a visual/motion pass).

**Rationale:** All three sections share the same structural pattern, so one technique applied consistently across all three keeps the site's motion language coherent rather than three one-off treatments.

---

### s5 — Built for Service Businesses

**Current:** Same right-aligned pattern as s3.

**Proposed changes:** Same blur/brightness focus cue as s2–s4 (technique #5), applied consistently.

**Rationale:** Structural twin of s2–s4 — same treatment, no unique needs.

---

### s6 — The VisionLab Method (intro)

**Current:** Centered heading + subcopy, orbit canvas background (`cvOrb`), short "Discover → Design → Deploy → Drive" line.

**Proposed changes:**
1. **Word-by-word reveal on the "Discover → Design → Deploy → Drive" line** (same adapted technique #14 used in s9/s10) — a short, punchy process statement is a good fit for the same "resolving into focus" treatment, and it's cheap since the line is already isolated in its own `<p>`.

**Rationale:** This is a brief transitional section (the actual 4-step content lives in s7), so kept to one small, consistent touch rather than inventing new motion — reuses a technique already earning its keep elsewhere on the site.

---

### s7 — From Vision to Visible (4-phase cards)

**Current:** 4 `.gcard` elements with ghost numerals (`.phase-num`), already staggered via `depth-enter` `data-d="2"`–`"5"`.

**Proposed changes:**
1. **Layered inset+outset shadow + offset-outline refinement on card hover** (technique #18, adapted to VisionLab's teal/orange palette instead of Jack's magenta): add a thin inset outline (`outline: 1px solid rgba(0,194,212,.4); outline-offset:-2px`) to `.gcard:hover` alongside the existing ambient glow shadow — extra edge definition on the hover state without touching the resting state.

**Explicitly NOT doing:** Converting this to a sticky-stacking card group (technique #13). Flagged in the notes as the standout technique for card sections, but per the Architecture Constraint it needs scroll room beyond 100vh — **stretch option only**, not part of this pass. If Stephen wants this specifically, it needs a separate conversation about whether s7 should stop being a snap-section.

**Rationale:** The ghost-numeral + stagger pattern is already correctly applied (confirms technique #5 from the notes). The hover refinement is a cheap, safe addition; the sticky-stack conversion is the one place in this plan where the most striking technique and the safest architecture choice conflict — surfaced explicitly rather than silently skipped or silently done.

---

### s8 — Pricing

**Current:** 3-column `.pc` card grid, ROI stat bar (`$180K–$400K`, `3–5 patients`, `30 days`), `.pc.active` (Growth tier) already has a distinct teal-tinted treatment.

**Proposed changes:**
1. **Count-up animation on the ROI bar numbers** when the section arrives: `$180K–$400K`, `3–5 patients`, `30 days` animate from 0 (or a lower placeholder) up to their real value over ~800ms–1s, keyed to the same arrival trigger as `depth-enter`. This was already flagged as a candidate in `DESIGN.md`'s own "what the upgrade should target" note — concrete, well-understood, low-risk, high-payoff for a stat-heavy trust section.
2. **Layered inset+outset shadow + offset-outline refinement on `.pc.active`** (technique #18): extra edge definition on the recommended (Growth) tier specifically, reinforcing "this is the one most clients pick" beyond the current glow-only treatment.

**Explicitly NOT doing:** Converting the pricing grid to sticky-stacking cards. Beyond the Architecture Constraint, this is also a **UX call, not just a technical one** — pricing tiers need side-by-side comparison (features, price) so a buyer can scan across them; stacking cards on top of each other actively works against that. Worth stating plainly: the "coolest" technique in the notes is the wrong fit for this specific section's job.

**Rationale:** Pricing is a top-priority (P1) section doing real conversion work. Both changes reinforce trust/comparison rather than adding motion for its own sake.

---

### s9 — Testimonial

**Current:** Single Dr. Newman quote with large decorative quote-mark glyphs, trigger-once `depth-enter`.

**Proposed changes:**
1. **Word-by-word (not full character-by-character — see note) scroll-reveal on the quote**, adapted from technique #14: instead of continuous scroll-scrub (not available under scroll-snap), stagger each word or short phrase's opacity (0.15 → 1) across the section's existing `depth-enter` arrival window, so the quote reads as "resolving into focus" as the section snaps into place rather than fading in flat. Word-level (not character-level) keeps the effect readable at normal snap-transition speed (~0.6–0.9s) instead of needing Mostar/Jack's much longer continuous-scroll window.

**Rationale:** This was the standout candidate from the notes for exactly this kind of editorial/pull-quote moment. Testimonial is P1 (trust-building), and this is the single highest-leverage text-motion technique available under the current architecture.

---

### s10 — About

**Current:** Stephen's photo (background-removed PNG), name/title, bio paragraph, trigger-once `depth-enter`.

**Proposed changes:**
1. **Restrained magnetic cursor-follow on the photo** (technique #16), much smaller padding/strength than the Jack example's hero-portrait version — a professional headshot should move a few pixels at most, not visibly "chase" the cursor. This is the one personal, human moment on the site; a small crafted touch here reads as intentional rather than gimmicky.
2. **Same word-by-word reveal treatment as s9** applied to the bio paragraph, for consistency between the two first-person trust-building passages on the site.

**Rationale:** P1 section per Open Question 3 — "the human behind the brand" is disproportionately important for a pre-revenue agency's credibility, worth the extra craft pass.

---

### s11 — CTA + Footer

**Current:** Heading, subcopy, single `.btn-oc` CTA ("Book a Free Call"), footer with copyright/LinkedIn/AI-demo-number/privacy links (`.fl` links already have proper hover states).

**Proposed changes:**
1. **Layered inset+outset shadow + offset-outline refinement on the final CTA button** (technique #18) — this is the last, most important click on the entire site; it should carry the most refined button treatment on the page, one notch beyond even the hero's `.btn-hero`.

**Leave alone:** Footer links — already have correct hover states per the existing guardrails, no gap to close.

**Rationale:** Low section, single highest-leverage element (the CTA button itself). No need to touch anything else here.

---

## Summary Table

| Section | Priority | Change | Technique(s) |
| --- | --- | --- | --- |
| Cross-cutting | P1 | Dedicated monospace typeface for micro-labels (`.sec-label`, `.card-label`, `.pc-tier`, `.stat-lbl`, `.roi-label`) | NovaAI #2 |
| s1 Services | P3 | Magnetic hover on icon circles + fold captions into shared label class | #16 |
| s0 Hero | P1 | Restrained headline parallax + scroll-velocity marquee speed | #4/16, #3 |
| s1 Services | P3 (skip) | None by default | — |
| s2–s5 Product/Why sections | P2 | Arrival-triggered blur/brightness focus cue | #5 |
| s6 Method intro | P3 | Word-by-word reveal on process line | #14 (adapted) |
| s7 Phase cards | P2 | Hover outline+shadow refinement | #18 |
| s8 Pricing | P1 | ROI count-up + active-tier outline refinement | count-up (own idea), #18 |
| s9 Testimonial | P1 | Word-by-word quote reveal | #14 (adapted) |
| s10 About | P1 | Restrained magnetic photo hover + bio word-reveal | #16, #14 (adapted) |
| s11 CTA+Footer | P2 | CTA button outline+shadow refinement | #18 |

**Not in this pass (stretch options, need separate sign-off):** true continuous scroll-scrub hero exit, sticky-stacking cards for s7 and/or s8.

---

## Review Checkpoint

1. **Scope — RESOLVED 2026-09-15:** Stephen confirmed full scope (all 12 sections, P1→P2→P3 implementation order). s1 and s6 updated above with light-touch changes rather than being skipped.
2. **Scroll-snap architecture — still open, not blocking.** The "adapted, not literal" approach to scroll-scrub/sticky-stacking stands as the default for this pass. If Stephen wants true sticky-stacking for s7/s8 specifically, that's a separate architecture conversation, not part of Step 5.
3. **Motion restraint — to be judged at screenshot review (Step 6), not decided upfront.** Every technique above was already written with a B2B-restrained version in mind (small magnetic-pull ranges, subtle parallax, no aggressive scale/rotation) — final call happens when Stephen sees it running, not before.
