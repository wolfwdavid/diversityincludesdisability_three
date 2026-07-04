# Diversity Includes Disability

An accessibility-first website for **Eman Rimawi-Doster** — intersectional disability equity
training, consulting, speaking, and modeling. Built to be a WCAG 2.2 AA (aspiring AAA) exemplar:
the medium proves the mission.

## Stack

- **SvelteKit 2 + Svelte 5** (runes), fully prerendered static output via `@sveltejs/adapter-static`
- **Vanilla CSS + semantic design tokens** (no utility framework) for total control of contrast,
  focus, and motion
- **Self-hosted fonts** — Atkinson Hyperlegible (body) + Lexend (headings), no third-party requests
- **GitHub Pages** deploy via GitHub Actions
- Layered a11y gate: `svelte-check`, `eslint-plugin-svelte`, `@axe-core/playwright`, `pa11y-ci`,
  plus a custom WCAG contrast checker

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:5173
```

## Quality & accessibility gate

```bash
node scripts/check-contrast.mjs   # WCAG contrast on the token palette
pnpm run check                    # svelte-check (type + a11y compiler warnings)
pnpm run lint                     # prettier + eslint (a11y rules)
pnpm run build                    # static build to ./build
pnpm run preview                  # serve the build at http://localhost:4173
pnpm run test:a11y                # axe-core across every route
pnpm run test:pa11y               # pa11y-ci WCAG2AA crawl (preview must be running)
```

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
The workflow sets `BASE_PATH=/<repo-name>` so assets resolve on the project subpath.
`static/.nojekyll` keeps Pages from stripping the `_app/` bundle.

## Accessibility

Conformance target: **WCAG 2.2 Level AA**. See the in-site Accessibility Statement for the
current status, testing method, and known limitations. Manual keyboard-only and screen-reader
passes are part of the release checklist — automated tooling alone is not sufficient.
