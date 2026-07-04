# Phase 1 · Plan 01 — Scaffold, Design Tokens & Deploy Plumbing

**Requirements:** FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07, FND-08, FND-09
**Depends on:** Nothing

## Goal
A prerendered, base-path-correct SvelteKit static site that builds clean, passes the a11y gate on its skeleton, and is wired to deploy to GitHub Pages.

## Tasks

1. **Project manifest & pins** — `package.json` (svelte 5, @sveltejs/kit 2, adapter-static 3, vite 6, svelte-check, eslint + eslint-plugin-svelte, prettier, @axe-core/playwright + @playwright/test, pa11y-ci, fontsource atkinson-hyperlegible + lexend-variable), `.nvmrc` (24), `.npmrc`, `.gitignore`. → FND-01, FND-08, FND-09
2. **SvelteKit config** — `svelte.config.js` (adapter-static, `paths.base` from `BASE_PATH`, `fallback: '404.html'`), `vite.config.js`, `tsconfig.json`/`jsconfig`, `.prettierrc`, `eslint.config.js`. → FND-01, FND-02
3. **App shell plumbing** — `src/app.html` (lang, meta), `src/routes/+layout.js` (`prerender=true`, `trailingSlash='always'`), minimal `src/routes/+layout.svelte`, placeholder `src/routes/+page.svelte`, `src/routes/+error.svelte`. → FND-05
4. **Design tokens** — `src/lib/styles/tokens.css` (primitive→semantic, AA-verified palette), `base.css` (reset, focus-visible, reduced-motion, forced-colors, fluid type, ≥24px targets), font `@import`s; load globally in layout. → FND-06, FND-07, FND-08
5. **Static/deploy** — `static/.nojekyll`, `static/robots.txt`; `.github/workflows/deploy.yml` (Pages artifact flow with `BASE_PATH`). → FND-03, FND-04
6. **a11y gate scripts + configs** — `.pa11yci.json`, `tests/a11y.spec.js` (axe per route), npm scripts `check`/`lint`/`test:a11y`/`build`. → FND-09
7. **Verify** — `pnpm install`, `pnpm run check`, `pnpm run lint`, `pnpm run build`, `pnpm run preview` + local axe pass at the subpath; contrast-verify the token palette. → all
8. **Wire remote** — add `origin` for `wolfwdavid/diversityincludesdisability_three` (push deferred to user-created repo; flag checkpoint).

## Success Criteria
1. Live-capable static build (`build/`) with base-path-correct assets — no blank page, no 404 assets (verified via `preview` at subpath).
2. GitHub Actions Pages workflow present + `.nojekyll`; every route prerendered.
3. All token color pairs pass WCAG 2.2 AA (7:1 body where feasible), tooling-verified.
4. Self-hosted fonts render with no third-party request, no layout shift.
5. `check` + `lint` + axe/pa11y report zero violations on the skeleton.

## Verification
`pnpm run check && pnpm run lint && pnpm run build && pnpm run preview` (manual axe + keyboard), contrast check on palette, confirm workflow + `.nojekyll` exist.
