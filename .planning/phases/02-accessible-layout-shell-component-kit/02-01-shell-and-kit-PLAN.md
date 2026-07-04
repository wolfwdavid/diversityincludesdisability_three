# Phase 2 · Plan 01 — Accessible Layout Shell & Component Kit

**Requirements:** SHELL-01..08
**Depends on:** Phase 1

## Tasks
1. `src/lib/content/site.js` — site name, nav items, socials, contact. → SHELL-02
2. `a11y/SkipLink.svelte`, `a11y/VisuallyHidden.svelte`. → SHELL-01
3. `ui/Button.svelte` (button/link, variants/sizes, 44px targets), `ui/Card.svelte` (heading-level prop), `ui/PageHeader.svelte`. → SHELL-05, SHELL-07
4. `nav/SiteHeader.svelte` (brand + accessible disclosure Nav: aria-expanded/controls, Esc, focus return, aria-current). → SHELL-02, SHELL-06
5. `nav/SiteFooter.svelte` (nav echo, socials, accessibility-statement link). → SHELL-02
6. `forms/Field.svelte` (label + control + aria-describedby error). → (used Phase 4)
7. Rewrite `src/routes/+layout.svelte`: skip link + landmarks + `afterNavigate` focus-to-main. → SHELL-01, SHELL-03, SHELL-04
8. Stub routes `/about /services /speaking /contact /accessibility` (unique title + h1). → SHELL-04
9. Extend `tests/a11y.spec.js` to audit every route; add a keyboard-nav test (skip link, disclosure Esc/focus-return).
10. Verify: check + lint + build + axe + manual keyboard reasoning.

## Success Criteria
1. Tab on load reveals skip link (first focusable) → focuses `<main>`; every page has landmarks w/ accessible names.
2. Keyboard-only open/close mobile nav (Esc closes, aria-expanded reflects, focus returns to toggle); visible focus everywhere.
3. Route change moves focus to main + unique title announced.
4. All targets ≥24px; usable under reduced-motion + forced-colors.
