# Diversity Includes Disability — Accessible Rebuild (v3)

## What This Is

A ground-up, accessibility-first rebuild of **diversityincludesdisability.org**, the professional site of **Eman Rimawi-Doster** — a disability equity consultant, trainer, speaker, and model. The current site is a thin 2-page Wix build (Home + "About Me"); this project rebuilds it as a full, best-in-class accessible consultancy website that both *showcases* accessibility (the medium proving the mission) and *converts* organizations into booking Eman for trainings, consulting, speaking, and modeling. Built with SvelteKit (static adapter) and deployed to GitHub Pages under the repo `diversityincludesdisability_three`.

## Core Value

The site must be a WCAG 2.2 AA (aspiring AAA where feasible) exemplar **and** make it obvious and easy for an organization to hire Eman. Accessibility and conversion are co-equal — a flawlessly accessible site that also drives professional inquiries, with no tradeoff between the two.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Rebuild as a multi-page consultancy site: Home, About, Services, Speaking/Portfolio, Contact
- [ ] Reuse and adapt real content from the existing live site + public bio (real, not lorem)
- [ ] Present the four service offerings: Intersectional Disability Equity & Inclusion trainings/facilitation, Disability Consulting, Modeling for Representation, Speaker & Panelist
- [ ] Engagement layer: a "Work with me" inquiry/booking CTA, testimonials/credibility, and a writing/news section
- [ ] WCAG 2.2 AA compliance throughout (aspire to AAA where feasible); skip links, semantic landmarks, keyboard nav, focus management, reduced-motion support, accessible forms
- [ ] Borrow proven accessibility & IA patterns from scope.org.uk (skip-link hierarchy, plain-language stats, multiple contact pathways, dedicated accessibility statement)
- [ ] Responsive, mobile-first layout with accessible collapsible navigation
- [ ] Publishable accessibility statement page
- [ ] Deploy to GitHub Pages from `diversityincludesdisability_three`

### Out of Scope

- Server-side backend / database — GitHub Pages is static-only; contact uses a static-friendly form service or mailto
- User accounts / auth — no logged-in experience needed
- Donation / fundraising flow — Eman's site is a consultancy, not a charity soliciting donations (unlike Scope, which is the *accessibility* reference only, not the *business-model* reference)
- E-commerce (adaptive clothing store) — acknowledged part of Eman's work but not this site's job
- Migrating off Wix's existing domain/DNS — deployment target is GitHub Pages; domain cutover is a separate decision for Eman

## Context

**The person.** Eman Rimawi-Doster is a New York native who became a bilateral (double) leg amputee in 2014 due to an aggressive form of lupus. She is Black, Palestinian, and a woman, and frames disability intersectionally. Career highlights: disability advocate at New York Lawyers for the Public Interest (from 2017), Access-A-Ride Coordinator & Organizer (~5.5 years), Executive Director of the Harlem Independent Living Center. She is also a spoken-word artist, poet, graphic novelist, adaptive-clothing designer, educator, and youth organizer (FUREE, Casa Atabex Ache, The Jed Foundation). She has delivered disability-inclusion training for the office of Manhattan Borough President Mark Levine.

**Existing site (to reuse/adapt).** Wix, 2 pages (Home, About Me). Services listed: Intersectional Disability Equity and Inclusion trainings & facilitation; Disability Consulting; Modeling for Representation; Speaker and Panelist. Contact: emanrimawi@gmail.com. Socials: Facebook, Twitter/X, LinkedIn, Instagram. © 2024 Eman Rimawi-Doster.

**Accessibility reference (scope.org.uk).** Gold-standard patterns observed: explicit skip-link hierarchy (skip to content/search/nav), semantic landmark regions, descriptive alt text conventions, `tel:` links, plain-language statistics paired with icons for cognitive accessibility, multiple contact pathways (phone/email/chat), a dedicated Accessibility section in the primary nav and footer, and mobile-first responsive navigation. We borrow these *patterns*, not Scope's branding or charity model.

**Fleet context.** This follows the same delivery pattern as the user's other SvelteKit → GitHub Pages sites (raj fleet, michelle_ngo rebuilds): SvelteKit + `adapter-static`, base-path handling for project Pages, deploy via GitHub Actions. Known gotchas from that fleet: correct `BASE_PATH` for `<user>.github.io/<repo>/`, `pnpm` vs `npm`, and `main` vs `master` branch for Pages.

**Content sensitivity.** Use only public content (live site + public interviews/bios). Never commit private credentials or scraped private material.

## Constraints

- **Tech stack**: SvelteKit + `@sveltejs/adapter-static` — static output only; must build to a fully static site deployable on GitHub Pages
- **Hosting**: GitHub Pages (project site at `wolfwdavid.github.io/diversityincludesdisability_three/` unless a custom domain is configured) — requires correct base path
- **Accessibility**: WCAG 2.2 AA is a hard floor, not a nice-to-have; it is the headline deliverable
- **Content**: Real content reused/adapted from the public live site and public bio; placeholder images only where real assets aren't accessible, clearly marked
- **Contact form**: Must work without a backend (static form service e.g. Formspree/Web3Forms, or accessible `mailto:` fallback)
- **Repo**: `diversityincludesdisability_three` (separate git repo, sibling to existing `_one`)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SvelteKit + adapter-static (not plain HTML/Astro) | Consistency with user's existing GH Pages fleet; reusable components; proven deploy path | — Pending |
| Scope.org.uk as accessibility reference only (not business model) | DID is a consultancy, not a donation-driven charity; borrow a11y/IA patterns, not fundraising | — Pending |
| Expand from 2 pages to full site + engagement layer | User chose "Full site + engagement"; thin Wix site under-serves a professional consultant | — Pending |
| Reuse real public content over lorem ipsum | Credibility + conversion depend on authentic bio and service copy | — Pending |
| Co-equal goals: accessibility exemplar AND conversion | The medium proving the mission, while still booking work | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-04 after initialization*
