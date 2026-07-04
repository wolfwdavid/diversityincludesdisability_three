<!-- GSD:project-start source:PROJECT.md -->
## Project

**Diversity Includes Disability — Accessible Rebuild (v3)**

A ground-up, accessibility-first rebuild of **diversityincludesdisability.org**, the professional site of **Eman Rimawi-Doster** — a disability equity consultant, trainer, speaker, and model. The current site is a thin 2-page Wix build (Home + "About Me"); this project rebuilds it as a full, best-in-class accessible consultancy website that both *showcases* accessibility (the medium proving the mission) and *converts* organizations into booking Eman for trainings, consulting, speaking, and modeling. Built with SvelteKit (static adapter) and deployed to GitHub Pages under the repo `diversityincludesdisability_three`.

**Core Value:** The site must be a WCAG 2.2 AA (aspiring AAA where feasible) exemplar **and** make it obvious and easy for an organization to hire Eman. Accessibility and conversion are co-equal — a flawlessly accessible site that also drives professional inquiries, with no tradeoff between the two.

### Constraints

- **Tech stack**: SvelteKit + `@sveltejs/adapter-static` — static output only; must build to a fully static site deployable on GitHub Pages
- **Hosting**: GitHub Pages (project site at `wolfwdavid.github.io/diversityincludesdisability_three/` unless a custom domain is configured) — requires correct base path
- **Accessibility**: WCAG 2.2 AA is a hard floor, not a nice-to-have; it is the headline deliverable
- **Content**: Real content reused/adapted from the public live site and public bio; placeholder images only where real assets aren't accessible, clearly marked
- **Contact form**: Must work without a backend (static form service e.g. Formspree/Web3Forms, or accessible `mailto:` fallback)
- **Repo**: `diversityincludesdisability_three` (separate git repo, sibling to existing `_one`)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## TL;DR Recommendation
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Svelte** | `5.56.x` | UI framework (runes reactivity) | Svelte 5 is the current stable line and the default for all new projects. Runes (`$state`, `$derived`, `$effect`, `$props`) replace the Svelte 4 `export let` / `$:` model with explicit, greppable reactivity. Svelte 5 retains and *improves* the compile-time a11y warnings. **Recommend Svelte 5 over 4** — 4 is legacy/maintenance-only and greenfield-on-4 would be immediate tech debt. |
| **SvelteKit** | `2.69.x` | App framework, routing, prerender | The framework layer. Its prerender engine is what produces static HTML for Pages. SvelteKit 2 + Svelte 5 is the supported, current pairing. |
| **@sveltejs/adapter-static** | `3.0.x` | Static site generation | Emits a pure static bundle (no Node server) — the *only* correct adapter for GitHub Pages. Handles the `fallback` 404/SPA file and works with `paths.base` for project-subpath deploys. |
| **Vite** | `8.1.x` (via `@sveltejs/vite-plugin-svelte` `7.x`) | Build tool / dev server | Bundler under SvelteKit. Pulled in transitively by the `sv` scaffolder — do not hand-pick a version; take what `sv create` pins. |
| **TypeScript** | `6.0.x` | Type safety | Recommended even for a marketing site: catches prop/accessibility-attribute typos at build time. Choose the TS (not JSDoc) option in `sv create`. |
| **pnpm** | `9.x`+ | Package manager | Matches the user's existing SvelteKit→Pages fleet (raj, michelle_ngo). Faster, disk-efficient, strict dependency resolution. **Use `pnpm`, not `npm`** — consistent with fleet gotchas and lockfile. |
| **Node.js** | **24 LTS** (`>=24 <25`) | Runtime for build/CI | Node 24 is the active LTS line in 2026. Pin it three ways: `.nvmrc`, `package.json` `engines`, and `setup-node` in CI, so local and Actions builds match. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@fontsource/atkinson-hyperlegible** | `5.2.x` | Self-hosted body/UI font | Always. Atkinson Hyperlegible was designed by the Braille Institute specifically to increase legibility for low-vision readers (disambiguated letterforms). On-mission for a disability-equity site and self-hosted = no third-party request, no CLS. |
| **@fontsource-variable/lexend** | `5.2.x` | Self-hosted display/heading font (variable) | Headings. Lexend is engineered to reduce reading fatigue/improve reading proficiency; variable axis keeps weight range in one small file. Pairs well with Atkinson for a clear type hierarchy. Single-font is also fine — keep the pairing only if it doesn't add weight. |
| **@axe-core/playwright** | `4.12.x` | Automated WCAG rule engine in E2E | Per-page a11y assertions inside Playwright tests. Industry-standard axe engine; zero false-positive philosophy; catches contrast, ARIA, name/role/value issues on the *rendered* DOM. |
| **axe-core** | `4.12.x` | Underlying rule engine | Transitive dep of the Playwright integration; listed for version pinning clarity. |
| **@playwright/test** | `1.61.x` | E2E test runner + real browsers | Runs the axe checks and keyboard-nav/focus-order tests against the built static site across Chromium/Firefox/WebKit. |
| **pa11y-ci** | `4.1.x` | Full-site WCAG2AA crawl gate | CI gate that crawls every route against WCAG2AA (HTML CodeSniffer + optional axe runner) and fails the build on violations. Complements axe/Playwright by covering *all* pages cheaply from a sitemap/URL list. |
| **@lhci/cli** (Lighthouse CI) | `0.15.x` | Accessibility + perf scoring | Optional. Adds a Lighthouse *accessibility score* budget (e.g. assert ≥ 100) plus performance/best-practices/SEO. Use as a trend/score gate, not the primary correctness gate (axe/pa11y are stricter for WCAG). |
| **@sveltejs/enhanced-img** | `0.11.x` | Build-time responsive images | Optional. Generates width/height + modern formats to prevent layout-shift (CLS) on portrait/portfolio imagery — CLS is both a perf and a cognitive-accessibility concern. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **sv** (`0.16.x`) | Official scaffolder (`pnpm dlx sv create`) | Replaces the old `npm create svelte`. Adds prettier/eslint/vitest/playwright/tailwind add-ons interactively. Use it, then swap the adapter to `adapter-static`. |
| **eslint-plugin-svelte** (`3.20.x`) | Lint incl. a11y rules | Ships Svelte-specific a11y lint rules (mirrors/extends the compiler warnings: `svelte/a11y-*`). Wire into flat config (`eslint.config.js`) with `eslint` `10.x` + `typescript-eslint` `8.x` + `globals`. |
| **svelte-check** (`4.7.x`) | Type + a11y diagnostics in CI | Runs the compiler diagnostics (including a11y warnings) headless. Add `--fail-on-warnings` in CI so a11y warnings block merges. |
| **prettier** (`3.9.x`) + **prettier-plugin-svelte** (`4.1.x`) | Formatting | Standard. Keep with `eslint-config-prettier` `10.x` to avoid rule conflicts. |
| **Svelte compiler a11y warnings** | Built-in a11y linting | **Free, always-on, first line of defense.** No install. Catches missing `alt`, invalid ARIA, non-interactive-element handlers, label association, etc. at compile time. Treat as errors in CI. |
## Installation
# 0. Scaffold (choose: TypeScript, ESLint, Prettier, Playwright, Vitest)
# 1. Swap to the static adapter (sv defaults to adapter-auto)
# 2. Self-hosted accessible fonts (no third-party requests, no CLS)
# 3. Accessibility test gate
# 4. (Optional) responsive images to prevent CLS
## The GitHub Pages Base-Path + Prerender Gotcha (READ THIS)
## Deployment: Official GitHub Actions Workflow
# .github/workflows/deploy.yml
## Accessibility Tooling — Which to Actually Wire In
| Layer | Tool | Catches | Wire in as |
|-------|------|---------|-----------|
| 1. Compile time | **Svelte a11y compiler warnings** (built-in) | Missing alt, bad ARIA, label/control association, click-without-key-handler | `svelte-check --fail-on-warnings` in CI + local pre-commit |
| 2. Lint | **eslint-plugin-svelte** (`svelte/a11y-*` rules) | Same class, plus project-wide consistency, in editor | `eslint.config.js` flat config; runs in editor + CI |
| 3. Rendered-DOM, per page | **@axe-core/playwright** | Contrast, computed ARIA, name/role/value, focus order (paired with keyboard tests) | Playwright E2E against the built site; one axe assertion per route |
| 4. Whole-site crawl | **pa11y-ci** | WCAG2AA violations across *every* URL, cheaply | CI step over a URL list / sitemap; `runner: [axe, htmlcs]` |
| 5. Score budget | **Lighthouse CI** (optional) | A11y *score* regression + perf/CLS | `lhci autorun` with `assert` budget (a11y ≥ 100) |
## Styling for Accessibility — Vanilla CSS, not Tailwind
- **Total control over the a11y-critical primitives.** Focus rings (`:focus-visible`), contrast tokens, and `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` media queries are first-class and readable, not buried behind utility-class variants. The site's whole value proposition is "the medium proves the mission" — hand-authored, auditable CSS *is* that proof.
- **Design tokens as custom properties** make a documented contrast system trivial:
- **Reduced motion, done right:**
- **Visible focus for everyone:** never `outline: none` without a replacement; standardize `:focus-visible { outline: var(--focus-ring); outline-offset: 2px; }`.
- **`forced-colors: active` / Windows High Contrast** support is easier to reason about in plain CSS.
- **Svelte scoped `<style>`** already gives component-scoped CSS with no naming collisions — you don't need Tailwind or CSS Modules for isolation.
### Fonts + contrast workflow (no CLS)
- **Self-host via Fontsource** (`@fontsource*`) — no Google Fonts network request (privacy + no render-blocking third party), and you import only the weights you use. Prevent CLS by (a) `font-display: swap` and (b) matching fallback metrics with `size-adjust`/`ascent-override` on an `@font-face` fallback, or simply preloading the primary weight. Variable fonts (Lexend) keep weight range in one file.
- **Pairing:** Atkinson Hyperlegible (body/UI, legibility-optimized) + Lexend Variable (headings, reading-fatigue-optimized). Both are *accessibility-motivated* typefaces — strong story for this client. A single-family setup (Atkinson only) is a valid simpler choice.
- **Color-contrast workflow:**
## Static-Friendly Contact Form
| Service | Free tier | Spam handling | Account? | Verdict |
|---------|-----------|---------------|----------|---------|
| **Web3Forms** ✅ | **250 submissions/mo**, unlimited forms | Honeypot (`botcheck` hidden field) + optional hCaptcha | No account — just an access key emailed to you | **Recommended.** Highest free volume, no signup friction, works identically with SvelteKit. Caveat: free plan auto-deletes submissions >30 days and no webhooks — fine here since it just emails Eman. |
| **Formspree** | ~50 submissions/mo free | reCAPTCHA + honeypot, dashboard | Yes | Solid alternative if a submission dashboard/inbox is wanted. Lower free volume. |
| **Getform** | ~50/mo, limited forms | Honeypot + captcha | Yes | Fine, but no advantage over the two above for this use. |
- Every input has an associated `<label for>` (not placeholder-as-label).
- Group related controls with `<fieldset>`/`<legend>`.
- Mark required fields with `required` + `aria-required` and a visible "(required)" text — not color alone.
- On submit error, move focus to an error summary (`role="alert"` / `aria-live="assertive"`), link each error to its field (`aria-describedby`), per WCAG 3.3.1/3.3.3.
- Honeypot field must be truly hidden from AT and sighted users but present in DOM: `aria-hidden="true"` + `tabindex="-1"` + off-screen CSS (do not use `display:none` if the service requires it submitted — follow Web3Forms' `botcheck` pattern).
- Provide the plain-text email (`emanrimawi@gmail.com`) and a `mailto:` link as the guaranteed fallback path (mirrors Scope's "multiple contact pathways" pattern).
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| SvelteKit + adapter-static | **Astro** | If the site were content-heavy/blog-first and you wanted islands + Markdown-native authoring. Here, fleet consistency (raj, michelle_ngo) and reusable Svelte components win. |
| SvelteKit + adapter-static | **Plain HTML/CSS** | Absolute-minimum sites. Rejected: no components, no prerender ergonomics, harder to keep 5 pages DRY and consistent. |
| Svelte 5 (runes) | **Svelte 4** | Only for maintaining an existing v4 codebase. Never for greenfield. |
| Vanilla CSS + custom properties | **Tailwind CSS** | Large teams wanting utility velocity where a11y is *not* the headline deliverable. Not here. |
| Web3Forms | **Formspree** | If Eman wants a hosted submission dashboard/inbox and 50/mo is enough. |
| pnpm | **npm** | Only if a contributor can't install pnpm. Fleet standard is pnpm. |
| @fontsource (self-host) | **Google Fonts CDN** | Never for this project — third-party request + privacy + CLS risk contradict the a11y/privacy posture. |
| pa11y-ci + axe | **Deque axe DevTools (paid) / WAVE** | Manual spot-audits during development. Not a CI gate. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Tailwind CSS** | Utility soup obscures semantics; default palette frequently fails AA; adds build/learning surface with no a11y benefit here | Vanilla CSS + custom properties + Svelte scoped styles |
| **Google Fonts / any CDN font** | Third-party request, privacy leak, render-block, CLS | Self-host via `@fontsource*` |
| **`adapter-auto` / `adapter-node`** | Auto guesses a platform; node needs a server — neither produces the static bundle Pages needs | `@sveltejs/adapter-static` with `fallback: '404.html'` |
| **Svelte 4 for greenfield** | Legacy line; no runes; immediate tech debt | Svelte 5 |
| **Hardcoded absolute links (`/about`, `/img.png`)** | 404 on the `/repo/` subpath — the classic Pages break | `import { base } from '$app/paths'` and prefix every internal href/src |
| **Skipping `.nojekyll`** | Jekyll strips `_app/*` assets → blank/broken site | Empty `static/.nojekyll` |
| **`outline: none` on focus** | Removes visible focus → WCAG 2.4.7 / 2.4.11 failure | `:focus-visible { outline: 3px solid … }` |
| **Placeholder-as-label** | Not an accessible name; disappears on input → 1.3.1/3.3.2 failure | Real `<label for>` |
| **Lighthouse a11y score as sole gate** | Checks only a subset of WCAG; passing ≠ conformant | axe + pa11y + manual keyboard/SR testing |
| **Client-only rendering / disabling prerender** | Defeats static hosting; hurts SEO and no-JS a11y baseline | `export const prerender = true` |
## Stack Patterns by Variant
- Set `paths.base = ''` (root serving) and drop the `BASE_PATH` env — the subpath handling is only for `user.github.io/repo/`.
- Add `static/CNAME` with the domain; keep `.nojekyll`.
- Move to Formspree paid or a serverless function (Cloudflare Pages Functions / Netlify Forms) — but that changes the host off GitHub Pages. Keep the `mailto:` fallback regardless.
- Add `mdsvex` for Markdown-in-Svelte authoring; still fully prerendered. Reconsider Astro only if it becomes content-dominant.
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `svelte@5.56` | `@sveltejs/kit@2.69` | Supported current pairing; SvelteKit 2 requires Svelte 5 for new features |
| `@sveltejs/kit@2.69` | `@sveltejs/adapter-static@3.0` | adapter majors track kit majors; 3.x is for kit 2.x |
| `@sveltejs/kit@2.69` | `vite@8` via `@sveltejs/vite-plugin-svelte@7` | Let `sv create` pin these together — don't mix manually |
| `eslint@10` | `eslint-plugin-svelte@3.20` + `typescript-eslint@8` | Flat config (`eslint.config.js`); needs `globals@17` |
| `@axe-core/playwright@4.12` | `@playwright/test@1.61` | axe integration rides on Playwright's page object |
| `prettier@3.9` | `prettier-plugin-svelte@4.1` + `eslint-config-prettier@10` | Standard formatting trio |
| Node `24 LTS` | all of the above | Pin via `.nvmrc` + `engines` + CI `setup-node` |
## Sources
- `svelte.dev/docs/kit/adapter-static` — GitHub Pages config (adapter `fallback`, `paths.base` via `BASE_PATH`, `prerender`, `.nojekyll`, deploy workflow) — **HIGH**
- npm registry (`npm view … version`, 2026-07-04) — exact current versions of svelte, @sveltejs/kit, adapter-static, vite-plugin-svelte, vite, eslint-plugin-svelte, @axe-core/playwright, axe-core, @playwright/test, pa11y-ci, @lhci/cli, typescript, svelte-check, prettier(-plugin-svelte), eslint, typescript-eslint, sv, @fontsource(-variable)/*, @sveltejs/enhanced-img — **HIGH**
- web3forms.com + docs.web3forms.com + 2026 comparison articles (splitforms, formgrid) — Web3Forms free tier (250/mo), honeypot `botcheck`, optional hCaptcha, no account, SvelteKit support, 30-day retention / no free webhooks — **HIGH**
- WCAG 2.2 AA/AAA success criteria (1.4.3/1.4.6 contrast, 1.4.11 non-text contrast, 2.4.7/2.4.11 focus, 3.3.1/3.3.2/3.3.3 forms, 2.3.3 reduced motion) — general standard — **HIGH**
- GitHub Actions marketplace tag currency (checkout/setup-node/upload-pages-artifact/deploy-pages majors) — **MEDIUM** (pin to latest confirmed major at build time)
- Project PROJECT.md — fleet gotchas (BASE_PATH, pnpm vs npm, main vs master) — **HIGH**
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
