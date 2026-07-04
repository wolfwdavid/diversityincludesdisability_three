# Project Research Summary

**Project:** diversityincludesdisability_three (Eman Rimawi-Doster consultancy/personal-brand site)
**Domain:** Accessibility-first static marketing/consultancy website (SvelteKit → GitHub Pages, WCAG 2.2 AA, aspiring AAA)
**Researched:** 2026-07-04
**Confidence:** HIGH

## Executive Summary

This is an accessibility-first, prerendered static marketing site for a disability-equity consultant, trainer, speaker, and model. The defining constraint is that **the medium must prove the mission**: because Eman sells accessibility expertise, any a11y defect on her own site is not a cosmetic bug but a direct contradiction of the product and a live liability to the sales pitch. Every accessibility failure is therefore a P0. Experts build this class of site as a component-driven, fully prerendered SvelteKit app (Svelte 5 runes + `adapter-static`) shipped to GitHub Pages via the official GitHub Actions Pages-artifact flow — no backend, no runtime data store, no API. "Data" is authored typed content compiled to HTML at build time; the only live client logic is hydration, route-change focus management, and progressive enhancement of the contact form.

The recommended approach is opinionated and consistent across all four research streams: **build the accessibility substrate first, then the reusable a11y component kit, then pages, then deploy.** Style with hand-authored **vanilla CSS + semantic design tokens** (not Tailwind) so contrast, `:focus-visible`, `prefers-reduced-motion`, and `forced-colors` are first-class and auditable — the hand-authored CSS *is* the proof of competence. Self-host accessibility-motivated fonts (Atkinson Hyperlegible + Lexend) via Fontsource for zero CLS and no third-party requests. Wire a layered automated a11y gate (Svelte compiler warnings → eslint-plugin-svelte → axe-core/Playwright → pa11y-ci), but treat automation as catching only ~30-40% of issues: manual keyboard-only and screen-reader passes are non-negotiable acceptance criteria. Contact runs through a static form service (**Web3Forms**, 250/mo, honeypot not CAPTCHA) with a `mailto:` fallback.

The key risks cluster in two areas. **Deployment mechanics**: the GitHub Pages project *subpath* breaks any root-absolute link/asset, and Jekyll silently strips the `_app/` directory without `.nojekyll` — both produce a blank/broken live site that looks perfect in local dev. **Accessibility correctness under hydration**: SPA route changes reset focus to `<body>` (announcing the title but stranding keyboard users at the top), forms commonly ship with unlabeled fields and un-announced validation errors, and custom disclosure nav is routinely built as inaccessible div-soup. All of these are well-documented with known fixes, so they are de-risked by *sequencing* — establish base-path/`.nojekyll`/deploy and the accessible layout shell + tokens before any content accumulates.

## Key Findings

### Recommended Stack

Fully prerendered SvelteKit 2 + Svelte 5 (runes) with `@sveltejs/adapter-static`, published to GitHub Pages by the official `upload-pages-artifact` → `deploy-pages` Actions flow. Vanilla CSS + custom properties over Tailwind for total control of a11y primitives. pnpm package manager, Node pinned to 24 LTS three ways (`.nvmrc` + `engines` + CI). Confidence is HIGH — core stack, GH Pages config, a11y tooling, and the contact-form service were all verified against official docs and the npm registry on 2026-07-04. The one MEDIUM caveat is the exact major tags of the GitHub Actions (pin to latest confirmed major at build time; v4/v3 are known-good).

**Core technologies:**
- **Svelte 5.56 + SvelteKit 2.69**: UI + app/routing/prerender framework — current supported pairing; runes give explicit reactivity and retain compile-time a11y warnings.
- **@sveltejs/adapter-static 3.0**: static site generation with `fallback: '404.html'` — the only correct adapter for Pages; handles `paths.base` subpath deploys.
- **Vanilla CSS + custom properties**: styling — first-class focus rings, contrast tokens, and `prefers-*` queries; Tailwind explicitly rejected (utility soup obscures semantics, default palette fails AA).
- **@fontsource/atkinson-hyperlegible + @fontsource-variable/lexend**: self-hosted accessibility-designed fonts — no third-party request, no CLS, on-mission story.
- **axe-core/Playwright + pa11y-ci (+ optional Lighthouse CI)**: layered automated WCAG gate — per-page and full-site crawl; complements built-in Svelte/eslint a11y linting.
- **Web3Forms**: static contact endpoint — 250/mo free, honeypot + optional hCaptcha, no account, `mailto:` fallback.

### Expected Features

The domain has an unusually strict table-stakes bar: for an accessibility consultant, an inaccessible site is disqualifying. Every feature is scored against a twin mandate — **A11y** (be a WCAG 2.2 AA/AAA exemplar) and **Conv** (convert an org into booking Eman). The strongest features serve both simultaneously and form the site's spine.

**Must have (table stakes):**
- Semantic landmark structure + skip-link hierarchy + keyboard operability with visible focus (WCAG 2.2 Focus Appearance) — the credibility floor.
- Clear outcome-led Services page (four offerings: Training/Facilitation, Consulting, Modeling, Speaking) + persistent, repeated "Work with me / Book Eman" CTA.
- Accessible contact form (real labels, `aria-describedby` errors, honeypot not CAPTCHA) + multiple contact pathways.
- Dedicated, dated Accessibility Statement (in nav *and* footer) — the headline deliverable, not boilerplate.
- Real bio/social proof + attributed testimonials; correct alt text; responsive accessible collapsible nav; reduced-motion support; AA contrast tokens; ≥24×24px targets.

**Should have (competitive differentiators):**
- **Native accessibility preferences panel** (contrast/theme, text-size, motion via CSS vars + `prefers-*`, persisted) — the flagship differentiator; the *right* way to give control (never a third-party overlay).
- Plain-language service summaries + plain-language stats with icons (scope.org.uk pattern) — cognitive access AND buyer skimmability.
- Downloadable accessible speaker one-sheet/media kit; captioned demo reel + transcripts; intersectional positioning as brand spine.

**Defer (v2+):**
- Writing/News/Press Markdown collection — until there's a publishing cadence.
- "Book a discovery call" scheduling integration — until inquiry volume justifies it.
- Multilingual content — only on demonstrated demand.

**Explicit anti-features (banned):** third-party accessibility overlay widgets (WAI-rejected, FTC hit accessiBe with a $1M settlement — self-discrediting here), donation/fundraising flow, e-commerce, user accounts/auth, autoplaying media/carousels, backend form processing, CAPTCHA, chat widgets, cookie-consent banners, custom-styled video players, and DNS migration off Wix.

### Architecture Approach

A three-layer content-to-HTML pipeline (typed content modules → reusable component kit → filesystem routes) plus a thin accessibility runtime, all prerendered by adapter-static. Exactly **one** `+layout.svelte` owns the document skeleton, all landmark regions, and route-change focus authority — pages render inside `<main id="main-content" tabindex="-1">` and never fork the shell. Repeating content (services, testimonials, writing index, nav/socials/meta) lives as typed `.ts` modules that force `alt` to be a required field, keeping copy and a11y discipline DRY. Design tokens are two-tier (primitive → semantic); components reference only semantic tokens, so AA contrast and theming are decided in one file. Build order is strictly inside-out.

**Major components:**
1. **Accessible layout shell (`+layout.svelte`/`+layout.ts`)** — skip link, landmarks, `afterNavigate` focus-to-`<main>`, `prerender = true`, `trailingSlash`.
2. **Accessible component kit (`lib/components` a11y/ui/nav/content)** — SkipLink, VisuallyHidden, Button, Field (label+error+`aria-describedby`), Nav (disclosure with `aria-expanded`), Card (heading-level as prop).
3. **Typed content modules (`lib/content/*.ts`)** — single source of truth for services/testimonials/writing/site metadata.
4. **Layered design tokens (`lib/styles` tokens→base→utilities)** — semantic contrast/motion/focus system driving all visual a11y.
5. **Filesystem routes (`src/routes`)** — Home/About/Services/Portfolio/Contact/Accessibility flat + Writing `[slug]` collection with `entries()`; CI Actions deploy to Pages.

### Critical Pitfalls

1. **Route-change focus lands on `<body>`, not new content** — give every page a unique descriptive `<title>` (drives the built-in announcer), keep a skip link to `<main tabindex="-1">`, and add a deliberate `afterNavigate` focus move; do not fight the framework or set `keepFocus` on normal nav.
2. **Wrong `base` path → every asset/link 404s on the `/diversityincludesdisability_three/` subpath** — set `kit.paths.base` from `BASE_PATH` env (empty in dev, prefix in CI), import `{ base }` from `$app/paths` for all internal links, and smoke-test under `vite preview` at the subpath.
3. **`_app/` stripped by Jekyll → blank white page** — use the Actions artifact flow (no Jekyll) *and* commit an empty `static/.nojekyll` as free insurance.
4. **Contrast + focus-outline failures — self-defeating for an a11y brand** — lock the palette to verified ratios in tokens up front (aim 7:1 body where feasible), never `outline: none` without a stronger `:focus-visible` ring, and gate with axe/pa11y + a manual keyboard pass.
5. **Contact form: unlabeled fields + silent (un-announced) validation errors** — real `<label for>`, `role="alert"`/`aria-live` error summary, `aria-invalid` + `aria-describedby`, focus-to-first-error, and an accessible success/thanks route.
6. **Prerender misses unlinked routes → 404 in production** — `prerender = true` in root layout, list non-crawlable routes in `kit.prerender.entries`, and set `handleHttpError` to fail CI on orphans (also covers custom nav div-soup, alt/heading errors, and uncaptioned media as adjacent content-phase pitfalls).

## Implications for Roadmap

Research points to a clear inside-out sequence. The strongest signal across ARCHITECTURE (suggested build order), PITFALLS (phase mapping), and FEATURES (dependency graph) is unanimous: **accessibility substrate + deploy plumbing first, component kit second, content pages third, differentiators and collection last.** Suggested phase structure:

### Phase 1: Foundation — Scaffold, Deploy Plumbing & Design Tokens
**Rationale:** All four research files converge here. The base-path/`.nojekyll`/prerender gotchas (Pitfalls 2/3/4/6) must be solved *before* content accumulates hardcoded links, and design tokens must exist before any component (retrofitting contrast is painful). Do a throwaway deploy early to de-risk the subpath.
**Delivers:** SvelteKit + adapter-static scaffold; `paths.base` from env; `static/.nojekyll`; `prerender=true`/`trailingSlash`; GitHub Actions Pages pipeline; token tier (primitive→semantic, AA contrast, `:focus-visible`, reduced-motion, forced-colors); self-hosted fonts; layered a11y CI gate (svelte-check `--fail-on-warnings`, eslint-plugin-svelte, axe/pa11y).
**Addresses:** Design tokens, contrast/focus/tap-target/motion (P1 features).
**Avoids:** Pitfalls 2, 3, 4, 5(contrast), 6 — the deployment + contrast footguns.

### Phase 2: Accessible Layout Shell & Component Kit
**Rationale:** The single `+layout.svelte` owns landmarks and route-change focus; pages consume the kit, so both must precede pages. Nav disclosure and Field primitives are the reused a11y-critical units.
**Delivers:** `+layout.svelte` (skip link, landmarks, `afterNavigate` focus-to-`<main>`); SkipLink, VisuallyHidden, Button, Card (heading-level prop), Field, Nav (disclosure with `aria-expanded`/Esc/focus-return), Footer.
**Uses:** Svelte 5 runes, `$app/navigation`, semantic tokens from Phase 1.
**Implements:** Layout shell + component kit (architecture components 1 & 2). **Avoids:** Pitfalls 1 (route focus), 7 (inaccessible nav).

### Phase 3: Content Data Modules & Core Pages
**Rationale:** Typed content shape must be defined before pages render it; pages are then thin composition. Each page owns a unique `<svelte:head>` title and one `<h1>`.
**Delivers:** `types.ts`, `services.ts`, `testimonials.ts`, `site.ts`; Home (intersectional positioning + primary CTA), About, Services (four outcome-led offerings + plain-language summaries), Speaking/Portfolio, with real imagery, alt text, per-page titles.
**Addresses:** Services, CTA, social proof, testimonials, positioning (P1 conversion features).
**Avoids:** Pitfalls 8 (alt/heading), 10 (authenticity — real photos, repeated CTA, attributed testimonials).

### Phase 4: Contact & Accessibility Statement
**Rationale:** The contact form is the conversion endpoint and a top a11y failure surface; the Accessibility Statement must be written last against the *actual* built site.
**Delivers:** Web3Forms-backed accessible form (labels, live-region errors, honeypot, `mailto:` fallback, prerendered thanks route) + multiple contact pathways; dated Accessibility Statement in nav + footer.
**Uses:** Web3Forms, Field primitive.
**Avoids:** Pitfall 5 (form errors), overclaiming in the statement.

### Phase 5: Differentiators & Conformance Pass
**Rationale:** Flagship differentiators depend on variable-driven tokens (preferences panel) and real assets (media kit, demo reel). The final conformance audit validates the whole AA/AAA claim.
**Delivers:** Native accessibility preferences panel; speaker one-sheet PDF; captioned demo reel + transcripts; plain-language stats; full axe/Lighthouse + manual keyboard + screen-reader audit documented in the Accessibility Statement.
**Avoids:** Pitfall 9 (reduced-motion + captions/transcripts); overlay anti-feature.

*(Writing/News collection and discovery-call scheduling are v2+ — a later phase only when cadence/volume justifies.)*

### Phase Ordering Rationale

- **Inside-out dependency chain** (unanimous across research): tokens → shell → kit → content → pages → differentiators. Building pages before tokens/kit guarantees rework.
- **Deploy plumbing lives in Phase 1, not the end** — the base-path/Jekyll/prerender pitfalls are the fleet's #1 failure mode and must be caught by a throwaway deploy before hardcoded links accumulate.
- **Accessibility Statement is written last** because it must honestly describe the real built site's conformance and known gaps.
- **Preferences panel is deferred** to Phase 5 because it depends on the token-as-CSS-variable system being mature and stable.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (preferences panel + media):** MEDIUM-HIGH complexity — `localStorage` persistence layered over `prefers-*` defaults, `data-theme` remapping, and accessible captioned-media embedding warrant a `/gsd:research-phase` pass on the panel state model and caption/transcript workflow.
- **Phase 1 (Actions tag currency):** minor flag — confirm the exact latest-stable major tags of the four GitHub Actions at build time (STACK flagged this MEDIUM).

Phases with standard patterns (skip research-phase):
- **Phases 1-4:** well-documented — SvelteKit adapter-static, layout shell/focus, typed content, and Web3Forms are all covered in detail by the research with verified official-doc patterns and fleet precedent (raj, michelle_ngo).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified against npm registry + official docs 2026-07-04; only Actions major tags are MEDIUM (pin at build time). |
| Features | HIGH | WCAG 2.2 criteria and overlay guidance verified against W3C/WAI + FTC action; conversion patterns MEDIUM-HIGH from multiple corroborating speaker-industry sources. |
| Architecture | HIGH | Routing/adapter/a11y focus behavior verified against official SvelteKit docs; component/content patterns are established convention. |
| Pitfalls | HIGH | SvelteKit a11y navigation behavior verified against official docs; base-path/Jekyll/prerender gotchas verified against official docs + direct fleet experience. |

**Overall confidence:** HIGH

### Gaps to Address

- **Real content availability:** testimonials (with attribution/permission), real photos of Eman, verified impact statistics, and captioned video assets are content dependencies, not engineering ones. Mark any placeholder clearly with a launch-blocking replace task; omit rather than fabricate testimonials.
- **Content sourcing sensitivity:** prior Notion/live-site exports contain plaintext credentials — use only public content, `.gitignore` scratch exports, and scan before any commit.
- **Automated-tool coverage ceiling:** axe/pa11y/Lighthouse catch only ~30-40% of WCAG issues; manual keyboard-only and NVDA/VoiceOver passes must be explicit acceptance criteria in every content and conformance phase, not optional.
- **Custom-domain variant:** if `diversityincludesdisability.org` is ever configured, `paths.base` flips to `''` and a `static/CNAME` is added — documented but out of current scope (DNS migration off Wix is explicitly deferred).

## Sources

### Primary (HIGH confidence)
- svelte.dev/docs/kit/adapter-static, /accessibility, /$app-navigation, /routing — prerender, base path, `.nojekyll`, route announcer, `afterNavigate`, `entries()`.
- npm registry (2026-07-04) — exact current versions of svelte, @sveltejs/kit, adapter-static, axe-core/playwright, pa11y-ci, fontsource, and toolchain.
- W3C WAI — What's New in WCAG 2.2 + WCAG 2.2 Recommendation — new AA criteria (Focus Appearance/Not Obscured, Target Size, Accessible Authentication).
- web3forms.com / docs.web3forms.com — free tier (250/mo), honeypot, hCaptcha, SvelteKit support.
- Accessible Web / WAI — overlays not endorsed; FTC accessiBe $1M settlement (Jan 2025).

### Secondary (MEDIUM confidence)
- The Speaker Lab / SpeakerHub / Alliance Interactive — speaker one-sheet + conversion features.
- scope.org.uk — accessibility/IA reference (skip-link hierarchy, plain-language stats, multiple contact pathways, dedicated accessibility page).
- metonym/sveltekit-gh-pages, okupter, Datawrapper — practical SvelteKit → Pages + a11y patterns.
- Fleet precedent (raj, michelle_ngo) — base-path/pnpm/main-vs-master/`.nojekyll` gotchas.

### Tertiary (LOW confidence)
- GitHub Actions marketplace tag currency — exact latest major tags to be confirmed at build time.

---
*Research completed: 2026-07-04*
*Ready for roadmap: yes*
