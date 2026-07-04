# Architecture Research

**Domain:** Accessible static multi-page marketing/consultancy site (SvelteKit + adapter-static → GitHub Pages)
**Researched:** 2026-07-04
**Confidence:** HIGH (SvelteKit routing/adapter/a11y behavior verified against official docs; component/content patterns are established convention)

## Standard Architecture

This is a **prerendered, component-driven static site**. There is no server, no runtime data store, and no API. "Data" is authored content compiled into HTML at build time; the only client-side runtime concerns are hydration, navigation focus management, and progressive-enhancement of the contact form. The architecture is therefore a **three-layer content-to-HTML pipeline** plus a thin **accessibility runtime**.

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER (authored)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────┐  │
│  │ services │ │testimon- │ │ writing/  │ │ page prose    │  │
│  │  .ts     │ │ ials.ts  │ │ news .md  │ │ (in-component │  │
│  │          │ │          │ │ or .ts    │ │ or .md)       │  │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └───────┬───────┘  │
│       │            │             │               │          │
├───────┴────────────┴─────────────┴───────────────┴──────────┤
│                COMPONENT LAYER (src/lib)                      │
├─────────────────────────────────────────────────────────────┤
│  Primitives            Composites          Layout shell      │
│  ┌────────┐ ┌────────┐ ┌──────────┐ ┌────┐ ┌──────────────┐ │
│  │ Button │ │ Skip-  │ │ Nav      │ │Card│ │ +layout.svelte│ │
│  │        │ │ Link   │ │(disclose)│ │    │ │ header/nav/   │ │
│  ├────────┤ ├────────┤ ├──────────┤ ├────┤ │ main/footer   │ │
│  │Visually│ │ Field  │ │Testimon- │ │Hero│ │ + skip link   │ │
│  │ Hidden │ │(+error)│ │ialCard   │ │    │ │ + focus mgmt  │ │
│  └────────┘ └────────┘ └──────────┘ └────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                ROUTE LAYER (src/routes)                      │
├─────────────────────────────────────────────────────────────┤
│  / (Home)  /about  /services  /portfolio  /contact           │
│  /accessibility   /writing   /writing/[slug]                 │
│  ── each is a +page.svelte, all prerendered ──               │
├─────────────────────────────────────────────────────────────┤
│         BUILD / DELIVERY (adapter-static → GH Pages)         │
│  vite build → prerender all routes → static HTML/CSS/JS      │
│  → GitHub Actions → gh-pages / Pages artifact                │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `+layout.svelte` (shell) | The single accessible frame: `<a class="skip-link">`, `<header>`, `<nav>`, `<main id="main-content" tabindex="-1">`, `<footer>`; owns route-change focus + reduced-motion class | One root layout; renders `{@render children()}` inside `<main>` |
| `+layout.ts` (root) | Turns the whole app static: `export const prerender = true` (+ `trailingSlash = 'always'`) | Data-less module, applies to all routes |
| `Nav` | Accessible primary navigation + mobile disclosure (hamburger) with correct `aria-expanded`/`aria-controls`, Esc-to-close, focus trap-free but focus-return | `<button>`-driven disclosure, `<ul>`/`<li>`/`<a>`, `aria-current="page"` |
| `SkipLink` | Visually-hidden-until-focused link jumping to `#main-content` | Anchor styled with `.sr-only` + `:focus` reveal |
| `VisuallyHidden` | Screen-reader-only text (labels, context) without visual footprint | Wrapper applying `.sr-only` utility |
| `Button` | One accessible interactive primitive: real `<button>` or `<a role=button>` variants, visible focus ring, sized for 24×24+ target | Slot/snippet-based, variant props |
| `Field` | Accessible form control wrapper: `<label>`, input, `aria-describedby` hint, `aria-invalid` + error message wiring | Composes label+control+error; used by Contact form |
| `Card` / `ServiceCard` | Content container with correct heading level passed in (no hard-coded `<h3>`) | Heading level as prop for hierarchy safety |
| `TestimonialCard` | Renders a testimonial with `<blockquote>`/`<cite>` | Data-driven from `testimonials.ts` |
| `Hero` / section blocks | Page-level composition units | Presentational, tokens-only styling |

## Recommended Project Structure

```
diversityincludesdisability_three/
├── .github/workflows/deploy.yml     # CI: build + publish to Pages
├── static/
│   ├── .nojekyll                    # REQUIRED: stop GH Jekyll eating _app/
│   ├── fonts/                       # self-hosted woff2 (perf + privacy)
│   └── images/                      # real photos, og image, favicon
├── src/
│   ├── app.html                     # <html lang="en">, %sveltekit.head%
│   ├── app.css                      # imports tokens + base + utilities
│   ├── lib/
│   │   ├── components/
│   │   │   ├── a11y/
│   │   │   │   ├── SkipLink.svelte
│   │   │   │   └── VisuallyHidden.svelte
│   │   │   ├── ui/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   └── Field.svelte     # label + input + error
│   │   │   ├── nav/
│   │   │   │   ├── Nav.svelte        # disclosure nav
│   │   │   │   └── Footer.svelte
│   │   │   └── content/
│   │   │       ├── Hero.svelte
│   │   │       ├── ServiceCard.svelte
│   │   │       └── TestimonialCard.svelte
│   │   ├── content/                 # STRUCTURED data (single source of truth)
│   │   │   ├── services.ts          # 4 offerings, typed
│   │   │   ├── testimonials.ts      # quote/author/role
│   │   │   ├── writing.ts           # news/writing index (or glob .md)
│   │   │   └── site.ts              # nav items, socials, contact, meta
│   │   ├── content/writing/*.md     # (optional) long-form via mdsvex
│   │   ├── styles/
│   │   │   ├── tokens.css           # CSS custom properties (design tokens)
│   │   │   ├── base.css             # reset, element defaults, focus-visible
│   │   │   └── utilities.css        # .sr-only, .container, motion helpers
│   │   ├── a11y/
│   │   │   └── heading.ts           # heading-level context helper (optional)
│   │   └── types.ts                 # Service, Testimonial, WritingEntry
│   └── routes/
│       ├── +layout.ts               # prerender = true; trailingSlash
│       ├── +layout.svelte           # THE accessible shell
│       ├── +error.svelte            # accessible error page
│       ├── +page.svelte             # Home
│       ├── about/+page.svelte
│       ├── services/+page.svelte
│       ├── portfolio/+page.svelte   # Speaking/Portfolio
│       ├── contact/+page.svelte     # static form service + mailto fallback
│       ├── accessibility/+page.svelte
│       └── writing/
│           ├── +page.svelte         # index list
│           └── [slug]/
│               ├── +page.ts         # entries() for prerender enumeration
│               └── +page.svelte
├── svelte.config.js                 # adapter-static + paths.base
├── vite.config.js
├── package.json                     # pnpm; scripts: dev/build/preview
├── .nvmrc / .npmrc                  # pin Node; pnpm settings (fleet gotcha)
└── tsconfig.json
```

### Structure Rationale

- **`routes/` mirrors the URL map 1:1.** Filesystem routing means the sitemap *is* the folder tree — trivially auditable, and every leaf is a prerender target. Home/About/Services/Portfolio/Contact/Accessibility are flat; Writing is a small collection with a dynamic `[slug]` child.
- **`lib/components/` split by role (a11y / ui / nav / content)** so the accessible primitives (SkipLink, VisuallyHidden, Button, Field) are a discoverable, reusable *kit* — every page composes from it, nothing re-implements a focus ring or an error pattern. This is the boundary that keeps WCAG conformance DRY.
- **`lib/content/` as typed data modules is the single source of truth** for anything that repeats or lists (4 services, testimonials, writing index, nav/socials). Pages import data and render components; copy is not scattered as magic strings across markup. Long-form articles/accessibility-statement prose can stay in-component or move to `.md` via mdsvex if editing cadence grows.
- **`lib/styles/` layered tokens → base → utilities** centralizes the contrast/theming/motion system so a single file governs AA color decisions (see Design Tokens below).
- **`static/.nojekyll` is non-negotiable** — without it GitHub Pages' Jekyll strips the `_app/` build directory and the site 404s its own assets (fleet-known gotcha).

## Architectural Patterns

### Pattern 1: Single Accessible Layout Shell (landmark frame + focus authority)

**What:** Exactly one `+layout.svelte` owns the document skeleton and all landmark regions. Every route renders *inside* `<main>`. Focus management on navigation lives here and nowhere else.

**When to use:** Always, for a multi-page a11y-exemplar site. Never duplicate `<header>`/`<nav>`/`<footer>` per page.

**Trade-offs:** One shell = consistent landmarks and one place to reason about focus (pro). Page-specific chrome must be driven by props/data, not by forking the layout (minor constraint).

**Example:**
```svelte
<!-- src/routes/+layout.svelte (Svelte 5 runes) -->
<script>
  import { afterNavigate } from '$app/navigation';
  import SkipLink from '$lib/components/a11y/SkipLink.svelte';
  import Nav from '$lib/components/nav/Nav.svelte';
  import Footer from '$lib/components/nav/Footer.svelte';
  let { children } = $props();
  let main;

  // Enhance SvelteKit's default (it focuses <body>): move focus to <main>
  // so keyboard/AT users land at content start, not document top.
  afterNavigate(() => main?.focus());
</script>

<SkipLink href="#main-content" />
<header><Nav /></header>
<main id="main-content" tabindex="-1" bind:this={main}>
  {@render children()}
</main>
<Footer />
```

### Pattern 2: Content-as-Typed-Data (author once, render many)

**What:** Repeating content lives in `src/lib/content/*.ts` as typed arrays; components consume it. Pages become thin composition.

**When to use:** Services list, testimonials, writing/news index, nav + social links, site metadata — anything listed, reused, or likely to change.

**Trade-offs:** Type safety + one edit point + consistent alt-text discipline (alt is a required field on image data) (pro). Slightly more indirection than inline HTML for truly one-off prose (so keep genuinely unique long copy in-component or `.md`).

**Example:**
```ts
// src/lib/content/services.ts
import type { Service } from '$lib/types';
export const services: Service[] = [
  { slug: 'trainings', title: 'Intersectional Disability Equity & Inclusion',
    summary: 'Trainings & facilitation…', cta: '/contact' },
  // …3 more
];
// src/lib/types.ts → export interface Service { slug; title; summary; cta }
// Image data types force `alt: string` so alt-text is never optional.
```

### Pattern 3: Layered Design Tokens via CSS Custom Properties

**What:** Two token tiers — *primitive* (raw palette) and *semantic* (role-based: `--color-text`, `--color-bg`, `--color-link`, `--focus-ring`). Components reference **only semantic** tokens. Preference variants (high-contrast, dark, reduced-motion) are just remapped semantic layers, toggled by media queries and/or a `data-theme` attribute on `<html>`.

**When to use:** From the first commit — retrofitting contrast/theming after components exist is painful.

**Trade-offs:** Guarantees AA contrast is decided in one file and reused everywhere; enables an optional high-contrast toggle for "aspire to AAA." Requires discipline: no raw hex in components.

**Example:**
```css
/* src/lib/styles/tokens.css */
:root {
  --c-ink-900:#141414; --c-paper-0:#ffffff;      /* primitives */
  --color-text: var(--c-ink-900);                 /* semantic */
  --color-bg:   var(--c-paper-0);
  --focus-ring: 3px solid #1a56db;                 /* AA-contrasting */
  --motion-fast: 150ms;
}
@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 0ms; }                    /* honor OS setting */
}
@media (prefers-contrast: more) { :root { --color-text:#000; } }
[data-theme="high-contrast"] { --color-text:#000; --color-bg:#fff; }
/* base.css */ *:focus-visible { outline: var(--focus-ring); outline-offset:2px; }
```

## Data Flow

### Build-Time Flow (there is no request/response — it's all prerender)

```
Author edits content/*.ts + *.md and page markup
      ↓ (pnpm build)
Vite + SvelteKit compile components
      ↓
adapter-static prerenders EVERY route (prerender=true)
   /  /about  /services  /portfolio  /contact  /accessibility
   /writing  /writing/<each slug from entries()>
      ↓
Static HTML + hashed CSS/JS in build/  →  GitHub Pages
      ↓ (browser)
HTML paints → SvelteKit hydrates → a11y runtime active
```

### Client Runtime Flow (the only live logic)

```
User clicks internal link
      ↓
SvelteKit client-side navigation (no full reload)
      ↓
① Route announcer live-region reads new <title>  (built-in)
② afterNavigate() moves focus to <main tabindex=-1> (our enhancement)
③ Reduced-motion class already applied at :root
      ↓
Contact form submit → progressive enhancement:
   JS present → fetch POST to Formspree/Web3Forms → inline aria-live status
   JS absent  → native form POST or mailto: fallback still works
```

### Key Data Flows

1. **Services / Testimonials / Writing index:** typed module → imported by `+page.svelte` → mapped into `ServiceCard`/`TestimonialCard`/list items. Change data, all views update; alt text travels with image data.
2. **Writing detail pages:** `writing/[slug]/+page.ts` `entries()` enumerates slugs so the prerenderer knows every page to emit (dynamic routes are NOT auto-discovered unless linked; `entries()` guarantees coverage).
3. **Navigation state:** `Nav` reads current path (`$page.url.pathname`) to set `aria-current="page"`; mobile disclosure state is local component state, reset/closed on `afterNavigate`.

## Route-Change Focus & Skip-Link Behavior (the a11y gotcha, explicitly)

This is the single most-missed accessibility defect in hydrated static sites — call it out as a first-class concern:

- **SvelteKit already does two things for free** (verified, current): it injects an `aria-live` **route announcer** that reads the new page `<title>` after each client-side navigation, and it **resets focus to `<body>`** after navigation/enhanced form submit. So a screen reader user *is* told the page changed — provided **every page has a unique, descriptive `<title>`** (set via `<svelte:head>` on each `+page.svelte`). This is a hard requirement, not optional.
- **Why `<body>` focus is not enough:** focusing `<body>` announces the title but drops the visual focus indicator and lands sighted-keyboard users at the very top (re-traversing nav each time). **Enhancement:** in the layout's `afterNavigate`, move focus to `<main id="main-content" tabindex="-1">`. Keyboard users then start at content; the route announcer still fires.
- **Skip link in an SPA:** `<a href="#main-content">` must target the same `#main-content` that `<main tabindex="-1">` carries. Because navigation is client-side, the target element is *always present in the persistent layout* — so the skip link keeps working across route changes (it would break only if `<main>`'s id lived inside per-page markup that unmounts). Keep the id on the layout's `<main>`.
- **Do not fight the framework:** don't build a second custom live-region announcer (double announcements) and don't call `goto(..., { keepFocus: true })` for normal nav (defeats focus reset). Reserve `keepFocus` for in-page filter/sort updates only.
- **Verify with a screen reader**, not just axe: automated tools do not catch a missing/duplicate navigation announcement.

## Scaling Considerations

"Scale" here is **content volume and contributor count**, not traffic (Pages serves static assets on a CDN; visitor scaling is a non-issue).

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Launch (5–8 pages, few testimonials) | Typed `.ts` content modules + in-component prose is ideal. No CMS. |
| Growing writing/news (10–40 posts) | Move `writing/` to `.md` via **mdsvex**; `import.meta.glob` to build the index; keep `entries()` for prerender. |
| Frequent non-dev editing | Consider a git-based headless CMS (e.g. Decap/Sveltia) writing Markdown into `content/writing/` — still fully static, no backend. Only adopt if a non-developer will edit. |

### Scaling Priorities

1. **First pressure point:** the writing/news list outgrows a hand-maintained `.ts` array → switch that one collection to Markdown-glob. Nothing else changes.
2. **Second pressure point:** editorial handoff to Eman/staff → git-based CMS layered on the same Markdown. The rest of the architecture is untouched because content is already decoupled from components.

## Anti-Patterns

### Anti-Pattern 1: Hard-coded heading levels inside reusable components

**What people do:** `Card.svelte` renders a literal `<h3>`.
**Why it's wrong:** Dropped into a page where the surrounding structure needs `<h2>`, it breaks the heading outline — a WCAG 1.3.1 / 2.4.6 failure and a real screen-reader navigation defect.
**Do this instead:** Pass the heading level (or a heading tag) as a prop, or render the heading in the page and pass content into the card via snippet. Keep one `<h1>` per page and no skipped levels.

### Anti-Pattern 2: Div-soup interactive controls

**What people do:** `<div on:click>` for the mobile menu toggle or buttons; custom focus styling that removes `:focus` outlines.
**Why it's wrong:** No keyboard operability, no role/state, no visible focus — multiple AA failures at once.
**Do this instead:** Real `<button>`/`<a>` elements, `aria-expanded`/`aria-controls` on the disclosure, and a global `:focus-visible` ring token. Never `outline: none` without a replacement.

### Anti-Pattern 3: Relying on training-data base-path habits / forgetting `.nojekyll`

**What people do:** Hard-link `/about`, `/images/x.png` (root-absolute) and omit `.nojekyll`.
**Why it's wrong:** On a project Pages subpath (`/diversityincludesdisability_three/`), root-absolute links 404, and Jekyll deletes `_app/`. Site appears blank/broken. (Documented fleet gotcha.)
**Do this instead:** Set `paths.base` from an env var in `svelte.config.js`, prefix internal links with `base` from `$app/paths` (or use SvelteKit link resolution), and commit `static/.nojekyll`.

### Anti-Pattern 4: Skipping `entries()` on the dynamic writing route

**What people do:** Assume `writing/[slug]` prerenders automatically.
**Why it's wrong:** The prerenderer only crawls *linked* pages; unlinked or paginated slugs silently never build.
**Do this instead:** Export `entries()` from `writing/[slug]/+page.ts` enumerating every slug.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Contact form (Formspree / Web3Forms) | Client `fetch` POST to their endpoint; progressive-enhancement over a native `<form action>` | Must degrade to native POST or `mailto:` with no JS; announce success/error via `aria-live` region, not just color |
| GitHub Pages | adapter-static output published via GitHub Actions | Correct `paths.base`, `.nojekyll`, artifact upload to Pages |
| Self-hosted fonts | `static/fonts/*.woff2` + `@font-face` with `font-display: swap` | Self-host (no Google Fonts CDN) for privacy + no layout-shift; preload the primary face |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Route ↔ Content module | ES import of typed data | One-way; pages never mutate content |
| Page ↔ Component kit | Props / snippets | Components are presentational; heading level passed in |
| Layout ↔ Page | `{@render children()}` + `<svelte:head>` per page | Layout owns landmarks + focus; page owns unique title + `<h1>` |
| Tokens ↔ Components | CSS custom properties (semantic only) | Components must not reference primitive tokens or raw hex |

## Suggested Build Order (dependency sequence for the roadmap)

Build **inside-out**: the accessibility substrate first, then the kit, then pages, then the collection, then deploy. Each step depends on the prior.

1. **Scaffold + static plumbing** — SvelteKit project, `adapter-static`, `+layout.ts` (`prerender=true`, `trailingSlash='always'`), `paths.base` from env, `static/.nojekyll`, pnpm/Node pins. *Gate: a blank page builds and previews under the subpath.*
2. **Design-token + CSS foundation** — `tokens.css` (primitive→semantic, AA contrast), `base.css` (reset + `:focus-visible` ring), `utilities.css` (`.sr-only`, container), reduced-motion + contrast media queries, self-hosted fonts. *Everything visual depends on this.*
3. **Accessible layout shell** — `+layout.svelte` with skip link, landmark regions, `<main tabindex=-1 id=main-content>`, `afterNavigate` focus, plus `SkipLink` + `VisuallyHidden`. *Gate: keyboard-only traversal + route-change focus verified with a screen reader.*
4. **Accessible component kit** — `Button`, `Card` (heading-level prop), `Field` (label+error+`aria-describedby`), `Nav` (disclosure), `Footer`. *Pages consume these; build before pages.*
5. **Content data modules** — `types.ts`, `services.ts`, `testimonials.ts`, `site.ts`, `writing.ts`. *Pages import these; define shape before pages render them.*
6. **Static pages** — Home → About → Services → Portfolio → Contact → Accessibility statement. Each gets a unique `<svelte:head>` title and one `<h1>`. Contact wires the form service + `mailto` fallback last.
7. **Writing/news collection** — `writing/+page.svelte` index + `[slug]` detail with `entries()` (upgrade to mdsvex only if volume warrants).
8. **CI deploy pipeline** — GitHub Actions build + Pages publish (below). *Do a throwaway deploy early after step 1 to de-risk base-path/Jekyll, then finalize here.*
9. **Conformance pass** — axe/Lighthouse + manual screen-reader + keyboard audit against WCAG 2.2 AA across all routes; fix; document in the Accessibility statement.

### GitHub Actions Deploy Pipeline Shape

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build            # BASE_PATH=/diversityincludesdisability_three via env
        env: { BASE_PATH: /diversityincludesdisability_three }
      - uses: actions/upload-pages-artifact@v3
        with: { path: build }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notes: use the official **Pages artifact** flow (not a `gh-pages` branch) — cleaner and it's the current recommended path. `svelte.config.js` reads `BASE_PATH` so local dev stays at `/` while CI builds for the subpath. Enable Pages → "GitHub Actions" as source in repo settings. Confirm `main` vs `master` matches the repo (fleet gotcha).

## Sources

- SvelteKit Accessibility (route announcements, focus reset to `<body>`, `keepFocus`) — https://svelte.dev/docs/kit/accessibility — HIGH
- `$app/navigation` (`afterNavigate`, `goto`) — https://svelte.dev/docs/kit/$app-navigation — HIGH
- SvelteKit Static site generation / `adapter-static` (prerender, `trailingSlash`, base path) — https://svelte.dev/docs/kit/adapter-static — HIGH
- metonym/sveltekit-gh-pages (minimal GH Pages setup, `.nojekyll`, base path) — https://github.com/metonym/sveltekit-gh-pages — MEDIUM
- Deploy SvelteKit to GitHub Pages (base path + Actions) — https://www.okupter.com/blog/deploy-sveltekit-website-to-github-pages — MEDIUM
- Building accessible sites with SvelteKit (practical a11y tips) — https://www.datawrapper.de/blog/sveltekit-accessibility-tips — MEDIUM
- Project fleet precedent (raj, michelle_ngo) — base-path/pnpm/branch gotchas — internal, HIGH

---
*Architecture research for: accessible SvelteKit static consultancy site → GitHub Pages*
*Researched: 2026-07-04*
