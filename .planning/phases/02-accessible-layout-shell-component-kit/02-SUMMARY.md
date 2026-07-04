# Phase 2 Summary — Accessible Layout Shell & Component Kit

**Completed:** 2026-07-04 · **Status:** ✅ Passed

## What shipped
- **Layout shell** (`+layout.svelte`): skip link → sticky `<header>` w/ primary `<nav>` → focus-managed `<main id="main-content" tabindex="-1">` → `<footer>`. `afterNavigate` moves focus to main on client-side navigation (skips initial load).
- **Component kit** (`src/lib/components/`): `a11y/SkipLink`, `a11y/VisuallyHidden`, `ui/Button` (button|link, variants/sizes, 44px targets, external-link handling), `ui/Card` (heading-level prop), `ui/PageHeader`, `nav/SiteHeader` (accessible disclosure nav), `nav/SiteFooter`, `forms/Field` (label + aria-describedby error + aria-invalid).
- **Content seed** (`src/lib/content/site.js`): site metadata, nav items, socials, contact.
- **Stub routes**: /about /services /speaking /contact /accessibility (unique titles + single h1), filled in Phases 3–4.
- **Tests**: axe across all 6 routes + skip-link + mobile-nav keyboard (Enter/Esc/focus-return) + accessible 404. All green.

## Verification
25/25 contrast AA · check 0/0 · lint clean · build clean (7 routes) · **9/9 Playwright a11y tests pass**.

## Key decisions
- Internal links use `base` from `$app/paths` (typed `resolve()` rejects data-driven hrefs); over-strict nav-resolve lint rule disabled.
- Headings inherit surface colour (dark-footer legibility).
- Disclosure nav is a real `<button>` with `aria-expanded`/`aria-controls`, Esc-to-close + focus return, `aria-current="page"`.

## Next
Phase 3 — Content Data Modules & Core Pages (real content via public sources + ui-ux-pro-max visual design).
