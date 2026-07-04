# Pitfalls Research

**Domain:** Accessibility-first (WCAG 2.2 AA+) multi-page SvelteKit static site → GitHub Pages project subpath, no backend
**Researched:** 2026-07-04
**Confidence:** HIGH (SvelteKit a11y navigation behavior verified against official docs; adapter-static / Pages gotchas verified against fleet experience and official docs)

> Special stakes for THIS project: the site is Eman Rimawi-Doster's professional storefront **and** a public proof-of-competence for accessibility consulting. An accessibility bug here is not a minor defect — it directly contradicts the product and undermines the sales pitch. Treat every a11y failure as a P0.

---

## Critical Pitfalls

### Pitfall 1: Route-change focus lands on `<body>`, not the new page's main content

**What goes wrong:**
Developers assume SvelteKit does nothing for SPA navigation and either (a) build a custom focus manager that fights the framework, or (b) assume it's fully handled and ship a broken experience. Reality: on client-side navigation SvelteKit focuses `<body>` and injects a live region that announces the new `<title>`. Focusing `<body>` is *safe* (focus isn't lost) but it is **not** the same as moving focus to `<main>` / the page `<h1>`. A keyboard/screen-reader user who clicks a nav link then presses Tab resumes tabbing from the *top of the document* (logo, nav) again, not from the new content — tedious on every navigation.

**Why it happens:**
The built-in behavior is invisible in casual testing (mouse users never notice). The announcement "works," so it looks done. The subtle focus-position problem only shows up in a real keyboard/AT walkthrough.

**How to avoid:**
- Give **every page a unique, descriptive `<title>`** via `<svelte:head>` — the built-in announcer reads it; a missing/duplicate title silently breaks the announcement.
- Keep a proper **skip link** ("Skip to main content") as the first focusable element, targeting `<main id="main-content" tabindex="-1">`. This gives users a one-key path to content after each navigation, compensating for the body-focus reset.
- If you want focus to move into `<main>` automatically on navigation, do it deliberately with an `afterNavigate` hook that calls `document.getElementById('main-content')?.focus()` — do **not** disable the built-in announcer.
- Do NOT set `keepFocus` on `goto` for normal nav (it can strand focus on an element that no longer exists).

**Warning signs:**
Tab after clicking a nav item starts from the header again; VoiceOver/NVDA says nothing (or repeats the same title) after a page change; two pages share a `<title>`.

**Phase to address:** Foundation / layout shell (skip link + `<main tabindex="-1">` + per-page title convention baked into the layout before any page content exists).

---

### Pitfall 2: Wrong `base` path → every asset and internal link 404s on the `/diversityincludesdisability_three/` subpath

**What goes wrong:**
The site works on `localhost:5173` (served at root) but on `wolfwdavid.github.io/diversityincludesdisability_three/` every stylesheet, image, font, and internal link 404s or points to the wrong place, because URLs were written as root-absolute (`/img/eman.jpg`, `href="/services"`) instead of base-aware. Result: an unstyled, image-less, un-navigable site at the real URL — the single most common GitHub Pages project-site failure.

**Why it happens:**
Root-absolute paths are the intuitive default and they work in dev. The base prefix only matters on a subpath deploy, which local dev doesn't simulate unless configured.

**How to avoid:**
- Set `kit.paths.base` from an env var: `base: process.env.BASE_PATH ?? ''` and set `BASE_PATH=/diversityincludesdisability_three` in the CI build step. (Empty in dev, correct prefix in prod.)
- **Never hardcode root-absolute internal links.** Import `{ base }` from `$app/paths` and write `href="{base}/services"`, `src="{base}/img/eman.jpg"`. In `app.html` use `%sveltekit.assets%` for favicon/manifest.
- For images in `static/`, reference them as `` `${base}/...` `` in markup; prefer importing assets so Vite rewrites the URL automatically.
- Add a Playwright/link-check smoke test that runs against a `vite preview` served under the base path, not just root.

**Warning signs:**
Site is unstyled on the live URL but fine locally; DevTools Network tab shows 404s at `/img/...` instead of `/diversityincludesdisability_three/img/...`; internal nav links jump to `github.io/services` (dropping the repo segment).

**Phase to address:** Foundation / deploy pipeline (configure `paths.base` + a base-path preview check as the *first* deployable increment, before content pages accumulate hardcoded links).

---

### Pitfall 3: `_app` directory stripped by Jekyll → blank white page (missing `.nojekyll`)

**What goes wrong:**
GitHub Pages runs Jekyll by default, and Jekyll **ignores files/folders beginning with an underscore**. SvelteKit emits its JS/CSS into `_app/immutable/...`. Deploy via the classic "deploy from a branch" method and Jekyll drops the entire `_app` folder → HTML loads but no JS/CSS → blank or broken page, often with no obvious error.

**Why it happens:**
Jekyll's underscore rule is undocumented in the SvelteKit build output; the failure is silent (HTML 200s, assets 404). Easy to miss if the modern Actions artifact flow isn't used.

**How to avoid:**
- Prefer the **official GitHub Actions Pages flow** (`actions/upload-pages-artifact` + `actions/deploy-pages`) — the artifact path does *not* run Jekyll, sidestepping the problem entirely. This is the recommended deploy method for this project.
- Belt-and-suspenders: add an empty **`static/.nojekyll`** file so it's copied into the build output regardless of deploy method. Zero cost, prevents the classic footgun.

**Warning signs:**
Blank page on live URL; `_app/immutable/*.js` returns 404; view-source shows correct HTML referencing `_app/...` that don't load.

**Phase to address:** Foundation / deploy pipeline (add `static/.nojekyll` and choose the Actions artifact flow before first deploy).

---

### Pitfall 4: Prerender misses pages not reachable by crawled links → those routes 404 in production

**What goes wrong:**
`adapter-static` prerenders by crawling links starting from the entry point. Any page not linked from another prerendered page (e.g., an accessibility statement only referenced in the footer that's conditionally rendered, a "thank you" page reached only after form submit, a blog post reachable only via JS) is **never generated** and returns 404 live. Build may pass without warning.

**Why it happens:**
Crawl-based discovery is invisible until a page is orphaned. Dev mode renders everything on demand, hiding the gap.

**How to avoid:**
- Set `export const prerender = true;` in the root `+layout.js` so the whole site is prerender-by-default.
- Explicitly list non-crawlable routes in `kit.prerender.entries` (e.g., `['*', '/contact/thanks']`).
- Set `kit.prerender.handleHttpError` to fail the build on unexpected 404s so orphaned links surface in CI instead of production.
- Provide a `fallback: '404.html'` in adapter config so GitHub Pages has a branded 404 for genuinely unknown URLs.

**Warning signs:**
A page works via in-app link but 404s on hard refresh / direct URL; CI build log shows fewer generated HTML files than you have routes; footer/thank-you pages missing from `build/`.

**Phase to address:** Deploy pipeline (prerender config) + each content phase that adds a route must confirm it appears in `build/`.

---

### Pitfall 5: Color-contrast and focus-outline failures — self-defeating for an accessibility brand

**What goes wrong:**
Brand palette (often a single accent color on white, or light-gray secondary text/placeholders) fails WCAG 2.2's contrast minimums: 4.5:1 for normal text, 3:1 for large text and for UI component/graphical-object boundaries (1.4.11). Separately, designers remove the default focus ring (`outline: none`) for aesthetics without a visible replacement, violating 2.4.7 and the newer 2.4.11 **Focus Not Obscured** and 2.4.13 **Focus Appearance**. On an accessibility-consultant site, an automated scanner (or a prospective client) catching this is reputationally fatal.

**Why it happens:**
Contrast looks "fine" to sighted designers; `outline: none` is a reflexive CSS habit; placeholder-as-label and gray-on-white are common design-trend defaults.

**How to avoid:**
- Lock the palette to verified ratios up front; put contrast tokens in the design system and test each pair (aim AAA 7:1 for body text where feasible, per the AAA aspiration).
- Never `outline: none` without a **more** visible `:focus-visible` style (thick, high-contrast, offset ring). Verify against 2.4.13 (min 3:1 against adjacent colors, minimum area).
- Ensure focused elements aren't hidden behind sticky headers (2.4.11) — add `scroll-margin-top`.
- Run axe-core / Lighthouse / Pa11y in CI as a gate; add a manual keyboard-tab pass to UAT.

**Warning signs:**
Lighthouse a11y < 100; axe reports "insufficient contrast"; you can't see where keyboard focus is when tabbing; focus disappears under the sticky nav.

**Phase to address:** Foundation / design tokens (palette + focus styles) with automated contrast + axe gate wired in the same phase.

---

### Pitfall 6: Accessible contact form — unlabeled fields and silent (un-announced) validation errors

**What goes wrong:**
The static contact form is the conversion mechanism, yet forms are the most common a11y failure: inputs labeled only by placeholder (disappears on typing, low contrast, not read reliably), required/error state shown only by red border or color, and — critically — **validation errors that never reach screen-reader users** because they're not in an `aria-live`/`role="alert"` region and the invalid field isn't tied to its message via `aria-describedby` + `aria-invalid`. A blind user submits, gets no feedback, and abandons — a lost booking.

**Why it happens:**
Placeholder-as-label is a persistent design trend; client-side validation is styled visually first; the "happy path" demos fine with a mouse and eyes.

**How to avoid:**
- Every field: a real, visible `<label for>` (not placeholder-only). Group related controls with `<fieldset>/<legend>`.
- On submit error: render messages in a container with `role="alert"` (or `aria-live="assertive"`), set `aria-invalid="true"` and `aria-describedby="<error-id>"` on the offending input, and move focus to the first invalid field (or a summary at the top).
- On success: announce confirmation in a live region and/or route to a prerendered "thanks" page with a descriptive `<title>` (ties back to Pitfall 4 — list it in prerender entries).
- Since there's no backend, use a static form service (Formspree / Web3Forms) that returns to your page, or an accessible `mailto:` fallback — and still handle its error/success states accessibly. Include a honeypot/anti-spam field that is `aria-hidden` and visually hidden so it doesn't confuse AT.

**Warning signs:**
Labels vanish when typing; errors are red-border-only; nothing is spoken after a failed submit; focus stays on the submit button after an error; no confirmation for AT users on success.

**Phase to address:** Contact/engagement phase (owns full accessible-form behavior incl. live-region error announcement and the prerendered thanks route).

---

### Pitfall 7: Custom collapsible nav / disclosure widgets that aren't actually accessible

**What goes wrong:**
The mobile-first collapsible nav (and any FAQ/service accordions) get built as `<div>`s with click handlers: no `aria-expanded`, no keyboard operability, no focus management when the menu opens, and — for an off-canvas menu — no focus *trap* while open plus no `Escape`-to-close and no focus-return to the trigger on close. Icon-only hamburger button ships with no accessible name. Keyboard and screen-reader users can't open, navigate, or escape the menu.

**Why it happens:**
Div-plus-onclick is the fastest path; visual behavior looks correct; ARIA and keyboard semantics are invisible unless explicitly tested. "Focus trap" is subtle — needed for modal/off-canvas overlays, but a *wrong* trap on a non-modal disclosure is also a bug.

**How to avoid:**
- Toggle: a real `<button>` with `aria-expanded`, `aria-controls`, and an accessible name (`aria-label="Menu"` or visually-hidden text next to the icon).
- Disclosure/accordion: button controls a region; toggle `aria-expanded`; content not in the tab order when collapsed (`hidden`).
- Off-canvas/modal menu: trap focus **only while open**, close on `Escape`, restore focus to the trigger on close, and mark background inert (`inert` attribute / `aria-hidden`).
- Prefer native `<details>/<summary>` for simple disclosures — free keyboard + AT support.
- Test the entire nav with keyboard only and with a screen reader before it's "done."

**Warning signs:**
Can't open the menu with Enter/Space; no `aria-expanded` in the DOM; Tab escapes an open modal to the page behind; Escape does nothing; focus is lost after closing; hamburger reads as "button" with no name.

**Phase to address:** Layout shell / navigation phase (nav + disclosure primitives), reused by any later accordion content.

---

### Pitfall 8: Alt-text and heading-hierarchy mistakes throughout content

**What goes wrong:**
Two chronic content-level failures: (1) **alt text** — meaningful images (Eman speaking, modeling shots that carry meaning) get empty/`alt=""` or generic "image", while purely decorative images get verbose alt that clutters the AT experience; portraits get file-name alt. (2) **Heading hierarchy** — multiple `<h1>`s or skipped levels (`h2` → `h4`) because headings are chosen for visual size, breaking screen-reader document navigation. For a modeling/representation angle, describing *who* and *what* in images is also brand-authentic, not just compliant.

**Why it happens:**
Alt text is an afterthought at content-entry time; headings are styled by appearance; CMS-less hand-authored markup makes it easy to grab the wrong tag.

**How to avoid:**
- Alt-text rule of thumb: decorative → `alt=""` (and `role="presentation"` if needed); informative → concise description of *meaning*; images of Eman → describe subject/context meaningfully (supports the representation mission).
- One `<h1>` per page (usually the page title); never skip heading levels; decouple heading level from visual size via CSS classes.
- Add lint/CI: `svelte-check` a11y warnings, eslint-plugin-svelte a11y rules, and an axe pass that flags missing alt / heading-order issues.

**Warning signs:**
axe/Lighthouse "heading levels should only increase by one" or "images must have alternate text"; screen-reader heading list (H key) is nonsensical; two H1s on a page.

**Phase to address:** Each content phase (About, Services, Speaking/Portfolio) owns alt text + heading structure for its own pages; enforce via a shared authoring checklist + CI a11y lint set up in Foundation.

---

### Pitfall 9: Motion and media without accommodations (reduced-motion, captions/transcripts)

**What goes wrong:**
Scroll animations, autoplaying carousels, or parallax ship without a `prefers-reduced-motion` guard (WCAG 2.3.3 / vestibular-disorder risk), and any embedded video (speaking clips, portfolio reels) or audio (spoken-word poetry — Eman is a spoken-word artist) ships **without captions or transcripts** (1.2.2 captions AA, 1.2.1/1.2.3 transcripts). For a disability-equity brand, uncaptioned media is a glaring contradiction.

**Why it happens:**
Motion is added for polish late; captions/transcripts are extra production work easily deferred and forgotten; YouTube embeds are assumed "handled" but auto-captions are often inaccurate/absent.

**How to avoid:**
- Wrap all non-essential animation in `@media (prefers-reduced-motion: reduce)` (disable/replace with instant states); default to subtle. Provide pause/stop controls for any auto-advancing carousel (2.2.2).
- Every video: accurate captions (not auto-only) + a text transcript on the page. Every audio/poetry clip: a full transcript. Prefer captioned sources; verify, don't assume.
- No autoplay with sound; respect `prefers-reduced-motion` for autoplaying visual media too.

**Warning signs:**
Animations still run with OS "reduce motion" on; videos have no CC track or an auto-generated one; audio embeds with no transcript; a carousel that can't be paused.

**Phase to address:** Design tokens/motion (reduced-motion baseline in Foundation) + Speaking/Portfolio phase (owns media captions/transcripts as acceptance criteria).

---

### Pitfall 10: Authenticity / content-credibility failures that tank conversion (and the mission)

**What goes wrong:**
Domain-specific conversion pitfalls that are *worse* for a disability-equity brand: (a) **stock-photo-only imagery**, especially generic or "inspiration-porn" disability stock, reads as inauthentic and off-brand — a disability consultant's site must show the real person and real representation; (b) **buried or single CTA** — "Work with me" hidden in the footer, no persistent/obvious booking path per service; (c) **unverifiable or vague testimonials** ("Great trainer! — Anonymous") that erode rather than build credibility; (d) **no accessibility statement** — the one page that proves the pitch and that scope.org.uk models is missing or is boilerplate that overclaims full AAA conformance.

**Why it happens:**
Stock photos are the fast placeholder; CTAs get deprioritized behind "content"; testimonials are hard to source so they get softened; accessibility statements are seen as legal boilerplate rather than a sales/credibility asset.

**How to avoid:**
- Use **real photos of Eman** and real representation imagery; mark any unavoidable placeholder clearly and replace before launch. No generic disability stock.
- Put a clear, repeated **"Work with me"** CTA in the header and at the end of each service section; make each of the four offerings individually bookable/inquirable.
- Testimonials: real attribution (name, org, role) with permission; if unavailable, omit rather than fake. Prefer named quotes tied to specific engagements (e.g., Manhattan Borough President's office training).
- Ship a genuine **accessibility statement**: conformance target (WCAG 2.2 AA, AAA where noted), known limitations, contact-for-issues path, and date — honest, not overclaiming. Link it in nav *and* footer (scope.org.uk pattern).

**Warning signs:**
Homepage hero is a stock image; you have to scroll to the footer to find how to hire; testimonials lack names/orgs; no `/accessibility` page or it claims blanket AAA conformance.

**Phase to address:** Content/IA phase for imagery + CTA placement + testimonials; dedicated Accessibility Statement phase/page (can pair with Foundation since it also drives the a11y acceptance bar).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Root-absolute URLs (`/img`, `/about`) instead of `base`-aware | Faster to type; works in dev | Total breakage on the subpath deploy; painful retrofit across every file | Never (subpath deploy is a hard constraint) |
| `outline: none` with no `:focus-visible` replacement | Cleaner visuals | WCAG 2.4.7/2.4.13 failure on an a11y-brand site | Never |
| Placeholder-as-label on the contact form | Less markup | Fails labeling + hurts the one conversion path | Never |
| Auto-captions on embedded video instead of reviewed captions | No transcription effort | Inaccurate captions on a disability brand = credibility hit | Only as a temporary pre-launch stopgap, clearly tracked |
| Skipping `static/.nojekyll` because "Actions doesn't need it" | One less file | Silent blank-page if deploy method ever changes to branch-based | Acceptable if 100% committed to the Actions artifact flow — but the file is free insurance |
| Hand-authoring headings by visual size | Fast styling | Broken screen-reader document outline | Never |
| Stock/placeholder imagery to "fill the layout" | Unblocks design | Inauthentic brand; must be replaced; risks shipping | Only as clearly-marked placeholder with a launch-blocking replace task |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages (project subpath) | Assuming root serving; wrong/missing `paths.base` | Set `base` from `BASE_PATH` env in CI; preview under the subpath before deploy |
| GitHub Actions → Pages | Missing `permissions:` block → deploy fails | `permissions: { pages: write, id-token: write, contents: read }` + `actions/deploy-pages` |
| Jekyll on Pages | `_app` folder stripped → blank page | Use Actions artifact flow (no Jekyll) and/or commit `static/.nojekyll` |
| Custom domain (if configured) | CNAME wiped on redeploy | Put `CNAME` in `static/` (persists in build) or rely on repo Settings + Actions flow; verify DNS after deploy |
| Formspree / Web3Forms (static form) | Redirects off-site or breaks AT feedback loop | Use their AJAX/return-to-page mode; announce success/error in `aria-live`; keep a `mailto:` fallback |
| pnpm in CI | Version drift vs local → lockfile/build mismatch | Pin `packageManager` in package.json + `.nvmrc`; `pnpm/action-setup` + `actions/setup-node` with `cache: pnpm` |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized full-res photos of Eman/portfolio | Slow LCP, huge transfer on mobile | Use `@sveltejs/enhanced-img` or pre-sized `srcset`/WebP; lazy-load below-fold | As soon as real high-res photos replace placeholders |
| Shipping large JS for a mostly-static site | Poor performance for low-bandwidth/AT users | Lean on prerendered HTML; minimal client JS; audit bundle | Grows silently as components accumulate |
| Fonts blocking render / layout shift | CLS, flash of unstyled text | `font-display: swap`, preload key font, self-host | Noticeable on first load over slow connections |

*Scale note: this is a low-traffic consultancy brochure site — the real "performance" concern is not throughput but **low-bandwidth and assistive-tech users**, so optimize for lightweight pages over hypothetical scale.*

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Committing private scraped content or credentials (Notion/live-site export) | Leaks private material; violates content-sensitivity constraint | Use only public content; `.gitignore` scratch exports; scan before commit |
| Exposing Eman's raw email to scrapers/spam | Inbox spam floods the sole contact channel | Prefer a form service; if `mailto:`, accept the tradeoff knowingly or obfuscate |
| Form service without spam protection | Spam submissions bury real booking inquiries | Enable honeypot/captcha in the form service (accessible honeypot, not a visual-only CAPTCHA) |
| Missing security headers / referrer leakage on external links | Minor, but `target="_blank"` without `rel` leaks/opens vector | `rel="noopener noreferrer"` on external links; set what headers Pages allows via meta |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Single skip link / no landmark structure | Keyboard/AT users can't jump to content, nav, or contact efficiently | scope.org.uk-style skip-link hierarchy + semantic landmarks (`header/nav/main/footer`, labeled regions) |
| Only one contact pathway | Excludes users who can't use that channel | Multiple pathways (accessible form + email + social), per scope.org.uk pattern |
| Icon-only social/action buttons | AT users hear "link" with no destination | Visually-hidden text or `aria-label` on every icon-only control |
| Dense prose with no plain-language summaries | Cognitive-accessibility barrier; buries the offer | Plain-language service summaries + stats-with-icons (scope.org.uk pattern) |
| Booking CTA only in footer | Low conversion; users don't find how to hire | Persistent header CTA + per-service inquiry buttons |

## "Looks Done But Isn't" Checklist

- [ ] **Live subpath deploy:** Looks fine locally — verify styles/images/links all resolve at `wolfwdavid.github.io/diversityincludesdisability_three/` (base path), not just root.
- [ ] **Every route direct-loads:** Often orphaned pages 404 on hard refresh — verify each route exists in `build/` and loads via direct URL, not just in-app navigation.
- [ ] **Keyboard-only pass:** Looks navigable with a mouse — verify full site (nav, menu, form, accordions, CTAs) is operable with keyboard alone, focus always visible and never trapped/lost.
- [ ] **Screen-reader pass:** Looks labeled — verify with NVDA/VoiceOver: page-change announcements fire, form errors are spoken, images/headings/buttons read sensibly.
- [ ] **Contact form round-trip:** Submit path works — verify error state announces via live region, success announces/redirects to a prerendered thanks page, and the message actually arrives.
- [ ] **Reduced motion:** Animations look nice — verify they disable/soften with OS "reduce motion" on.
- [ ] **Media accommodations:** Videos/audio embedded — verify captions (reviewed, not auto) and transcripts exist.
- [ ] **Accessibility statement:** Page exists — verify it states real conformance (WCAG 2.2 AA), known limitations, a contact-for-issues path, and a date — no overclaiming.
- [ ] **Automated + manual a11y gate:** Lighthouse/axe pass — remember automated tools catch ~30–40%; the manual keyboard + SR passes above are non-optional.
- [ ] **Real imagery:** Layout filled — verify no placeholder/stock images remain in shipped pages.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong base path (assets 404 live) | LOW–MEDIUM | Set `paths.base` + `BASE_PATH` in CI; find/replace root-absolute URLs with `base`-aware; add subpath preview check; redeploy |
| `_app` stripped / blank page | LOW | Add `static/.nojekyll` and/or switch to Actions artifact flow; redeploy |
| Orphaned route 404s | LOW | Add route to `prerender.entries`, set `handleHttpError` to fail build; redeploy |
| Inaccessible custom nav shipped | MEDIUM | Replace div-onclick with `<button>`+ARIA / native `<details>`; add focus trap + Escape for modal; re-test with keyboard + SR |
| Form errors not announced | MEDIUM | Add `role="alert"` region, `aria-invalid`/`aria-describedby`, focus-to-error; re-test with SR |
| Contrast/focus failures across palette | MEDIUM–HIGH | Re-derive tokens to hit ratios; add `:focus-visible` ring; re-audit every text/UI pair — costly if caught after full build |
| Uncaptioned media at launch | MEDIUM | Produce reviewed captions + transcripts; block launch until added |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Route-change focus / per-page titles / skip link (P1) | Foundation — layout shell | Keyboard + SR walkthrough: announcement fires, skip link works |
| Base path / asset & link 404s (P2) | Foundation — deploy pipeline | Preview under subpath; Network tab clean; link check |
| `.nojekyll` / Jekyll strip (P3) | Foundation — deploy pipeline | Live URL renders styled; `_app/*.js` returns 200 |
| Prerender orphans / 404 fallback (P4) | Deploy pipeline + every content phase | Each route in `build/`; direct-URL load; CI fails on unexpected 404 |
| Contrast + focus outline (P5) | Foundation — design tokens | axe/Lighthouse contrast pass; visible focus everywhere incl. under sticky header |
| Accessible contact form + error announce (P6) | Contact/engagement phase | SR hears errors + success; keyboard submit; message delivered |
| Custom nav / disclosure widgets (P7) | Layout/navigation phase | Keyboard-open, Escape-close, focus-return, `aria-expanded` present |
| Alt text + heading hierarchy (P8) | Each content phase (About/Services/Portfolio) | axe heading-order + alt checks; SR heading list sensible |
| Reduced motion + media captions/transcripts (P9) | Design tokens (motion) + Portfolio phase (media) | OS reduce-motion honored; captions/transcripts present |
| Authenticity: imagery, CTA, testimonials, a11y statement (P10) | Content/IA phase + Accessibility Statement page | Real photos only; header + per-service CTA; attributed testimonials; honest statement live in nav + footer |

## Sources

- [Accessibility • SvelteKit Docs](https://svelte.dev/docs/kit/accessibility) — built-in `<body>` focus on navigation, injected live-region title announcement, unique-title requirement, `keepFocus` caveat (HIGH)
- [kit/documentation/.../accessibility.md (main)](https://github.com/sveltejs/kit/blob/main/documentation/docs/40-best-practices/10-accessibility.md) — same, source of truth (HIGH)
- [sveltejs/kit issue #307 — manage focus / aria-live announce navigation](https://github.com/sveltejs/kit/issues/307) — history/rationale of the built-in announcer (MEDIUM)
- [sveltejs/kit issue #971 — visible "Navigated to…" in production](https://github.com/sveltejs/kit/issues/971) — announcer gotchas (MEDIUM)
- [$app/navigation • SvelteKit Docs](https://svelte.dev/docs/kit/$app-navigation) — `afterNavigate`, `goto` options for focus (HIGH)
- [Routing • SvelteKit Docs](https://svelte.dev/docs/kit/routing) — prerender/entries behavior (HIGH)
- [Datawrapper — Building accessible sites with SvelteKit](https://www.datawrapper.de/blog/sveltekit-accessibility-tips) — practical SvelteKit a11y tips (MEDIUM)
- WCAG 2.2 AA success criteria referenced: 1.2.1/1.2.2/1.2.3 (captions/transcripts), 1.4.3/1.4.11 (contrast), 2.2.2 (pause/stop), 2.3.3 (motion from interaction), 2.4.7/2.4.11/2.4.13 (focus visible/not obscured/appearance), 3.3.1 (error identification) (HIGH — W3C normative)
- Fleet experience: user's prior SvelteKit → GitHub Pages sites (raj fleet, michelle_ngo rebuilds) — base path, pnpm-vs-npm, main-vs-master, `.nojekyll` (MEDIUM — direct project history)

---
*Pitfalls research for: accessibility-first SvelteKit static site on GitHub Pages*
*Researched: 2026-07-04*
