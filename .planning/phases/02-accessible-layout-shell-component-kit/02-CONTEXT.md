# Phase 2: Accessible Layout Shell & Component Kit - Context

**Gathered:** 2026-07-04
**Status:** Ready for planning

<domain>
## Phase Boundary
One accessible `+layout.svelte` shell (skip link, landmarks, route-change focus, keyboard-operable primary nav with mobile disclosure) plus the reusable a11y component kit every page will compose from. No real page content — stub routes only, filled in Phases 3–4.
</domain>

<decisions>
## Implementation Decisions

### Layout shell
- Single `+layout.svelte` owns: skip link → `<header>` (brand + primary `<nav>`) → `<main id="main-content" tabindex="-1">` → `<footer>`.
- Route-change focus: `afterNavigate` moves focus to `#main-content` on real navigations (skip the initial `enter`), complementing SvelteKit's built-in title announcer. Each page supplies a unique `<title>`.
- Nav: desktop horizontal list; mobile disclosure button with `aria-expanded`, `aria-controls`, Esc-to-close + focus return to toggle, `aria-current="page"` on the active link. Reduced-motion respected.

### Component kit (`src/lib/components/`)
- `a11y/SkipLink`, `a11y/VisuallyHidden`
- `ui/Button` (renders `<button>` or `<a class="button">`; variants primary/secondary/ghost; sizes; 44px min target)
- `ui/Card` (configurable heading level via prop to preserve document outline)
- `nav/SiteHeader` (brand + Nav disclosure), `nav/SiteFooter` (nav echo + socials + a11y-statement link)
- `forms/Field` (label + control + error via `aria-describedby`/`aria-invalid`; used in Phase 4)
- `ui/PageHeader` (consistent h1 + intro per page)

### Content seed
- `src/lib/content/site.js` — site metadata, `navItems`, `socials`, contact email. Extended with real copy in Phase 3.

### Stub routes (so nav links resolve + prerender passes)
- `/about`, `/services`, `/speaking`, `/contact`, `/accessibility` — minimal unique `<title>` + single `<h1>` placeholders; real content later.
</decisions>

<code_context>
## Existing Code Insights
- Phase 1 tokens (`tokens.css`, `base.css`) — components reference semantic tokens only.
- `resolve()` from `$app/paths` for all internal links (lint-enforced). `.container` + `.visually-hidden` utilities exist.
</code_context>

<specifics>
## Specific Ideas
- Nav disclosure must be a real `<button>` (not div soup) — research PITFALL P7.
- Keep the skip link targeting the persistent-layout `#main-content` so it survives client-side nav.
</specifics>

<deferred>
## Deferred Ideas
- Real page content, imagery, services/testimonials data → Phase 3.
- Contact form wiring (Field is built here, used there) → Phase 4.
- Accessibility preferences panel → Phase 5.
</deferred>
