# Phase 1: Foundation — Scaffold, Deploy Plumbing & Design Tokens - Context

**Gathered:** 2026-07-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up a prerendered, base-path-correct SvelteKit static site that deploys to GitHub Pages, on top of an accessibility token substrate (AA contrast, visible focus, reduced-motion, forced-colors, self-hosted fonts) and a layered a11y CI gate. No page content or components beyond a minimal skeleton — those are Phases 2–3.
</domain>

<decisions>
## Implementation Decisions

### Stack & Tooling (per research/STACK.md — Claude's discretion, infra phase)
- SvelteKit 2 + Svelte 5 (runes), `@sveltejs/adapter-static`, Vite. Package manager: pnpm. Node 24 pinned (`.nvmrc` + `engines`).
- `paths.base` from `BASE_PATH` env (empty in dev, `/diversityincludesdisability_three` in CI). `import { base } from '$app/paths'` for all internal links/assets.
- `prerender = true` + `trailingSlash = 'always'` in root `+layout.js`. `fallback: '404.html'`. `static/.nojekyll` committed.
- Fonts: self-hosted `@fontsource/atkinson-hyperlegible` (body/UI, dyslexia-friendly, high legibility) + `@fontsource-variable/lexend` (headings). No third-party/CDN font requests.
- a11y gate: `svelte-check`, `eslint` + `eslint-plugin-svelte` (a11y rules), `@axe-core/playwright` (per-page), `pa11y-ci` (WCAG2AA crawl). Wired in `package.json` scripts + a CI job.

### Design Tokens (accessible substrate — refined visually in Phase 3 via ui-ux-pro-max)
- Two-tier CSS custom properties: primitive palette → semantic roles. Components reference semantic tokens only.
- Palette: warm off-white surfaces, near-black ink, **deep plum/purple** primary (disability-community color) + **warm gold** secondary accent, verified AA (≥4.5:1 text, aim 7:1 body) and non-color-dependent.
- Global: `:focus-visible` ring (thick, offset, high-contrast — WCAG 2.2 Focus Appearance), `prefers-reduced-motion` guard, `forced-colors` friendliness, ≥24px interactive target sizing baseline, fluid type scale.

### Deployment (per user: repo created by USER)
- GitHub Actions workflow (`upload-pages-artifact` → `deploy-pages`) building with `BASE_PATH=/diversityincludesdisability_three`. Add `origin` remote for `wolfwdavid/diversityincludesdisability_three`. Do NOT block on push/Pages-enable — flag as checkpoint.

### Claude's Discretion
Pure infrastructure phase — all implementation choices at Claude's discretion, guided by research/STACK.md and research/PITFALLS.md.
</decisions>

<code_context>
## Existing Code Insights
Greenfield — no code yet. Fleet precedent (raj, michelle_ngo) informs the SvelteKit→Pages base-path/`.nojekyll`/main-branch setup.
</code_context>

<specifics>
## Specific Ideas
- Do a throwaway/local `vite preview` under the subpath early to de-risk the base-path + Jekyll gotchas (research PITFALLS P2/P3).
- Accessibility is the headline deliverable — the CI gate must fail the build on a11y violations, not just warn.
</specifics>

<deferred>
## Deferred Ideas
- Full brand visual design (imagery, component styling, layout) → Phase 3 (ui-ux-pro-max).
- Writing/News collection → v2.
</deferred>
