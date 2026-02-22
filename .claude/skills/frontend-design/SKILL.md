# Frontend Design Skill

You are now in frontend design mode. Before writing any code, internalize and apply every rule below for this entire session.

---

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color **exactly**. Swap in placeholder content (`https://placehold.co/` for images, generic copy). Do **not** improve or add to the design.
- If no reference image: design from scratch with high craft using the guardrails below.
- After every build, screenshot and compare against the reference. Fix all mismatches. Do **at least 2 comparison rounds**. Stop only when no visible differences remain or the user says so.

---

## Local Server
- Always serve on localhost — never screenshot a `file:///` URL.
- Start dev server: `node serve.mjs` (serves project root at `http://localhost:3000`)
- `serve.mjs` is in the project root. Start it in the background before screenshotting.
- If server is already running, do not start a second instance.

---

## Screenshot Workflow
- Always screenshot from localhost: `node screenshot.mjs http://localhost:3000`
- Screenshots save to `./temporary screenshots/screenshot-N.png` (auto-incremented).
- Optional label: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool to analyze it visually.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.

---

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive.

---

## Brand Assets
- Always check the `brand_assets/` folder before designing.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.
- Do not use placeholders where real assets are available.

---

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

---

## Hard Rules
- Do not add sections, features, or content not in the reference.
- Do not "improve" a reference design — match it exactly.
- Do not stop after one screenshot pass — always do at least 2.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as primary color.

---

Skill loaded. Ready to build.
