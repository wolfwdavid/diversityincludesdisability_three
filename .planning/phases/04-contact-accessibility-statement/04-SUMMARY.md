# Phase 4 Summary — Contact & Accessibility Statement

**Completed:** 2026-07-04 · **Status:** ✅ Passed

## What shipped
- **Contact page**: accessible form built on the `Field` primitive (real labels, `aria-describedby`, `aria-invalid`). Client-side Web3Forms submission (no backend) via `$env/dynamic/public` key, with a `mailto:` fallback when unconfigured. Error summary (`role="alert"`) with per-error anchor links, focus moved to it on validation failure; announced success/error/unconfigured states via `aria-live`. Labelled honeypot (no CAPTCHA). Aside with email + social pathways + "another format" note.
- **Accessibility Statement** (`/accessibility/`): dated, honest — WCAG 2.2 AA target, what's built in, automated + manual testing method, known limitations (placeholder photos, external links), and a feedback route (email + form). Linked in primary nav and footer.
- **Test**: added a Playwright test asserting the contact form announces validation errors and moves focus to the summary.

## Verification
check 0/0 · lint clean · build clean (7 routes) · Playwright **10/10** a11y pass.

## Notes
- Live email delivery activates when `PUBLIC_WEB3FORMS_KEY` is provided; get a free key at web3forms.com and set it in `.env` (and the Pages build env).
- Test server pinned to port 5290 to dodge a foreign `vite preview` squatting the default ports.

## Next
Phase 5 — Accessibility preferences panel, plain-language stats, media kit, and full conformance audit.
