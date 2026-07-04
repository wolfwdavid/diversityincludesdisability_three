# Stack Research

**Domain:** Accessibility-first static marketing/consultancy website (SvelteKit → GitHub Pages, WCAG 2.2 AA, aspiring AAA)
**Researched:** 2026-07-04
**Confidence:** HIGH (core stack + GH Pages config verified against official docs and npm registry; a11y tooling verified; contact-form services verified via current vendor docs)

---

## TL;DR Recommendation

Build with **SvelteKit 2 + Svelte 5 (runes) + `@sveltejs/adapter-static`**, ship **fully prerendered static HTML** to GitHub Pages via the **official `actions/deploy-pages` workflow**, style with **vanilla CSS + custom properties (no Tailwind)** for total control over contrast/focus/reduced-motion, self-host **Atkinson Hyperlegible + Lexend** via Fontsource (zero CLS, no third-party font requests), and wire a **layered a11y test gate**: Svelte compiler warnings → `eslint-plugin-svelte` → `@axe-core/playwright` (per-page) → `pa11y-ci` (full-site WCAG2AA crawl) → optional Lighthouse CI. Contact via **Web3Forms** (no backend, honeypot + optional hCaptcha) with a **`mailto:` fallback**. Package manager **pnpm**, Node **pinned to 24 LTS**.

---

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

---

## Installation

```bash
# 0. Scaffold (choose: TypeScript, ESLint, Prettier, Playwright, Vitest)
pnpm dlx sv create diversityincludesdisability_three

# 1. Swap to the static adapter (sv defaults to adapter-auto)
pnpm add -D @sveltejs/adapter-static

# 2. Self-hosted accessible fonts (no third-party requests, no CLS)
pnpm add @fontsource/atkinson-hyperlegible @fontsource-variable/lexend

# 3. Accessibility test gate
pnpm add -D @axe-core/playwright pa11y-ci
pnpm add -D @lhci/cli        # optional: Lighthouse score budget

# 4. (Optional) responsive images to prevent CLS
pnpm add -D @sveltejs/enhanced-img
```

No CSS framework is installed on purpose (see "What NOT to Use").

---

## The GitHub Pages Base-Path + Prerender Gotcha (READ THIS)

This is the #1 source of broken deploys in the user's fleet. A project Pages site serves from
`https://wolfwdavid.github.io/diversityincludesdisability_three/` — a **subpath**, not root. Get all four pieces right:

**1. `svelte.config.js` — base path from env + static adapter + 404 fallback:**
```js
import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: {
      // dev serves at root; prod serves at /<repo>
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    }
  }
};
export default config;
```

**2. Root `+layout.js` — prerender the whole site (this is what makes it static):**
```js
export const prerender = true;
```

**3. Use the `base` path for every internal link/asset.** Hardcoded `/about` or `/logo.svg` will 404 on Pages.
```svelte
<script>import { base } from '$app/paths';</script>
<a href="{base}/services">Services</a>
<img src="{base}/eman.jpg" alt="Eman Rimawi-Doster speaking at a podium" />
```

**4. `.nojekyll`** — add an empty `static/.nojekyll` file so GitHub Pages does not run Jekyll (Jekyll ignores `_`-prefixed files, which breaks SvelteKit's `_app` assets). adapter-static copies `static/` verbatim into `build/`.

**Confidence: HIGH** — verified against `svelte.dev/docs/kit/adapter-static` (2026-07-04).

---

## Deployment: Official GitHub Actions Workflow

Adapted from the official SvelteKit docs (pnpm variant). `BASE_PATH` is injected at build time from the repo name, so links resolve to the subpath automatically.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: 'main'      # fleet gotcha: Pages must build from the branch you push (main, not master)

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4          # installs pnpm from packageManager field
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
        run: pnpm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then in repo **Settings → Pages → Build and deployment → Source = GitHub Actions**.

> **Version note:** The official docs page currently shows newer major tags (`checkout@v7`, `setup-node@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`). Those tags appear ahead of the widely-adopted stable majors and could not be independently confirmed on the Marketplace at research time. **Pin to the latest confirmed major of each action at build time** (v4/v3 shown above are safe, current, and known-good). Confidence: MEDIUM on exact action major tags; HIGH on the workflow shape (`upload-pages-artifact` → `deploy-pages`, `pages: write` + `id-token: write`, artifact path `build/`).

---

## Accessibility Tooling — Which to Actually Wire In

A **layered gate**, cheapest/fastest first. Each layer catches what the previous can't.

| Layer | Tool | Catches | Wire in as |
|-------|------|---------|-----------|
| 1. Compile time | **Svelte a11y compiler warnings** (built-in) | Missing alt, bad ARIA, label/control association, click-without-key-handler | `svelte-check --fail-on-warnings` in CI + local pre-commit |
| 2. Lint | **eslint-plugin-svelte** (`svelte/a11y-*` rules) | Same class, plus project-wide consistency, in editor | `eslint.config.js` flat config; runs in editor + CI |
| 3. Rendered-DOM, per page | **@axe-core/playwright** | Contrast, computed ARIA, name/role/value, focus order (paired with keyboard tests) | Playwright E2E against the built site; one axe assertion per route |
| 4. Whole-site crawl | **pa11y-ci** | WCAG2AA violations across *every* URL, cheaply | CI step over a URL list / sitemap; `runner: [axe, htmlcs]` |
| 5. Score budget | **Lighthouse CI** (optional) | A11y *score* regression + perf/CLS | `lhci autorun` with `assert` budget (a11y ≥ 100) |

**Prescription:** Layers 1–4 are the real gate (install and require in CI). Layer 5 is a nice-to-have trend guard — do **not** rely on Lighthouse's a11y score as proof of WCAG conformance (it only checks a subset). Keyboard-navigation, focus-visible, and screen-reader-name tests must be written by hand in Playwright — no automated tool covers ~100% of WCAG; automated tooling catches roughly 30–50% of issues, so **manual testing (keyboard-only pass, VoiceOver/NVDA spot-check) is still required** for the AA floor / AAA aspiration.

**Confidence: HIGH** on tool selection and roles; the "automated catches ~a third" caveat is well-established WCAG guidance (MEDIUM on exact percentage).

---

## Styling for Accessibility — Vanilla CSS, not Tailwind

**Recommendation: vanilla CSS + custom properties (CSS variables) + native nesting. Do NOT use Tailwind for this project.**

Why vanilla CSS wins *for an accessibility exemplar*:

- **Total control over the a11y-critical primitives.** Focus rings (`:focus-visible`), contrast tokens, and `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` media queries are first-class and readable, not buried behind utility-class variants. The site's whole value proposition is "the medium proves the mission" — hand-authored, auditable CSS *is* that proof.
- **Design tokens as custom properties** make a documented contrast system trivial:
  ```css
  :root {
    --color-text: #1a1a1a;      /* on --color-bg: verified ≥ 7:1 (AAA) */
    --color-bg: #ffffff;
    --color-accent: #0b5cad;    /* verified ≥ 4.5:1 on white (AA) */
    --focus-ring: 3px solid #0b5cad;
  }
  ```
- **Reduced motion, done right:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **Visible focus for everyone:** never `outline: none` without a replacement; standardize `:focus-visible { outline: var(--focus-ring); outline-offset: 2px; }`.
- **`forced-colors: active` / Windows High Contrast** support is easier to reason about in plain CSS.
- **Svelte scoped `<style>`** already gives component-scoped CSS with no naming collisions — you don't need Tailwind or CSS Modules for isolation.

Tailwind's utility classes tempt `div`-soup and inline styling that obscures semantics; its default gray palette often fails AA; and it adds a build dependency and learning surface with no a11y upside here. **Skip it.** (Sass is also unnecessary — native CSS nesting + custom properties cover it; add `sass` only if a contributor strongly prefers it.)

**Confidence: HIGH** (opinionated but well-grounded for an a11y-first static site).

### Fonts + contrast workflow (no CLS)

- **Self-host via Fontsource** (`@fontsource*`) — no Google Fonts network request (privacy + no render-blocking third party), and you import only the weights you use. Prevent CLS by (a) `font-display: swap` and (b) matching fallback metrics with `size-adjust`/`ascent-override` on an `@font-face` fallback, or simply preloading the primary weight. Variable fonts (Lexend) keep weight range in one file.
- **Pairing:** Atkinson Hyperlegible (body/UI, legibility-optimized) + Lexend Variable (headings, reading-fatigue-optimized). Both are *accessibility-motivated* typefaces — strong story for this client. A single-family setup (Atkinson only) is a valid simpler choice.
- **Color-contrast workflow:**
  1. Define all color pairs as tokens (above).
  2. Verify each foreground/background pair with a WCAG contrast checker — target **7:1 for body text (AAA)** where feasible, **4.5:1 minimum (AA)** for normal text, **3:1** for large text/UI components/focus indicators (WCAG 2.2 SC 1.4.11 non-text contrast + 2.4.11 focus appearance).
  3. Enforce continuously: axe-core (layer 3) and pa11y (layer 4) both flag contrast failures on the rendered site, so the token system is regression-guarded automatically.
  4. Check `prefers-contrast: more` and `forced-colors` overrides manually.

---

## Static-Friendly Contact Form

No backend allowed (Pages is static). Ranked recommendation:

| Service | Free tier | Spam handling | Account? | Verdict |
|---------|-----------|---------------|----------|---------|
| **Web3Forms** ✅ | **250 submissions/mo**, unlimited forms | Honeypot (`botcheck` hidden field) + optional hCaptcha | No account — just an access key emailed to you | **Recommended.** Highest free volume, no signup friction, works identically with SvelteKit. Caveat: free plan auto-deletes submissions >30 days and no webhooks — fine here since it just emails Eman. |
| **Formspree** | ~50 submissions/mo free | reCAPTCHA + honeypot, dashboard | Yes | Solid alternative if a submission dashboard/inbox is wanted. Lower free volume. |
| **Getform** | ~50/mo, limited forms | Honeypot + captcha | Yes | Fine, but no advantage over the two above for this use. |

**Prescription:** **Web3Forms** as primary, with a **`mailto:` fallback** for JS-off / service-outage resilience.

Accessible form markup requirements (hard AA rules):
- Every input has an associated `<label for>` (not placeholder-as-label).
- Group related controls with `<fieldset>`/`<legend>`.
- Mark required fields with `required` + `aria-required` and a visible "(required)" text — not color alone.
- On submit error, move focus to an error summary (`role="alert"` / `aria-live="assertive"`), link each error to its field (`aria-describedby`), per WCAG 3.3.1/3.3.3.
- Honeypot field must be truly hidden from AT and sighted users but present in DOM: `aria-hidden="true"` + `tabindex="-1"` + off-screen CSS (do not use `display:none` if the service requires it submitted — follow Web3Forms' `botcheck` pattern).
- Provide the plain-text email (`emanrimawi@gmail.com`) and a `mailto:` link as the guaranteed fallback path (mirrors Scope's "multiple contact pathways" pattern).

**Confidence: HIGH** — Web3Forms free tier (250/mo, honeypot + optional hCaptcha, no account, SvelteKit-compatible) verified against current vendor + comparison docs (2026-07-04).

---

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

---

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

---

## Stack Patterns by Variant

**If a custom domain is later configured (e.g. diversityincludesdisability.org via CNAME):**
- Set `paths.base = ''` (root serving) and drop the `BASE_PATH` env — the subpath handling is only for `user.github.io/repo/`.
- Add `static/CNAME` with the domain; keep `.nojekyll`.

**If the contact form outgrows 250 submissions/mo or needs webhooks/CRM:**
- Move to Formspree paid or a serverless function (Cloudflare Pages Functions / Netlify Forms) — but that changes the host off GitHub Pages. Keep the `mailto:` fallback regardless.

**If the writing/news section grows into a real blog:**
- Add `mdsvex` for Markdown-in-Svelte authoring; still fully prerendered. Reconsider Astro only if it becomes content-dominant.

---

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

---

## Sources

- `svelte.dev/docs/kit/adapter-static` — GitHub Pages config (adapter `fallback`, `paths.base` via `BASE_PATH`, `prerender`, `.nojekyll`, deploy workflow) — **HIGH**
- npm registry (`npm view … version`, 2026-07-04) — exact current versions of svelte, @sveltejs/kit, adapter-static, vite-plugin-svelte, vite, eslint-plugin-svelte, @axe-core/playwright, axe-core, @playwright/test, pa11y-ci, @lhci/cli, typescript, svelte-check, prettier(-plugin-svelte), eslint, typescript-eslint, sv, @fontsource(-variable)/*, @sveltejs/enhanced-img — **HIGH**
- web3forms.com + docs.web3forms.com + 2026 comparison articles (splitforms, formgrid) — Web3Forms free tier (250/mo), honeypot `botcheck`, optional hCaptcha, no account, SvelteKit support, 30-day retention / no free webhooks — **HIGH**
- WCAG 2.2 AA/AAA success criteria (1.4.3/1.4.6 contrast, 1.4.11 non-text contrast, 2.4.7/2.4.11 focus, 3.3.1/3.3.2/3.3.3 forms, 2.3.3 reduced motion) — general standard — **HIGH**
- GitHub Actions marketplace tag currency (checkout/setup-node/upload-pages-artifact/deploy-pages majors) — **MEDIUM** (pin to latest confirmed major at build time)
- Project PROJECT.md — fleet gotchas (BASE_PATH, pnpm vs npm, main vs master) — **HIGH**

---
*Stack research for: accessibility-first static SvelteKit consultancy site → GitHub Pages*
*Researched: 2026-07-04*
