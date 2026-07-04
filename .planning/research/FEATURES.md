# Feature Research

**Domain:** Accessibility-first consultancy / personal-brand site for a disability equity consultant, trainer, speaker & model (static SvelteKit → GitHub Pages)
**Researched:** 2026-07-04
**Confidence:** HIGH (WCAG 2.2 criteria and overlay guidance verified against W3C/WAI, FTC action, and speaker-industry sources; conversion patterns MEDIUM-HIGH from multiple corroborating sources)

## Framing: Two Co-Equal Goals

Every feature below is scored against the project's twin mandate:

- **A11y** — does it help the site *be* a WCAG 2.2 AA (aspiring AAA) exemplar? (The medium proving the mission.)
- **Conv** — does it help *convert* an organization into booking Eman for training, consulting, speaking, or modeling?

The strongest features (marked **BOTH**) serve accessibility AND conversion simultaneously — these are the spine of the site. A captioned demo reel is both an access feature and a sales asset. A plain-language services page both aids cognition and shortens the buyer's path to "yes."

## Feature Landscape

### Table Stakes (Users Expect These)

Missing any of these makes the site fail one or both goals. For an accessibility consultant, an inaccessible site is disqualifying — table stakes here are stricter than a generic consultant site.

| Feature | Why Expected | Complexity | Serves | Notes |
|---------|--------------|------------|--------|-------|
| Semantic landmark structure (`header`/`nav`/`main`/`footer`, one `h1`/page, logical heading order) | Baseline WCAG 1.3.1 / screen-reader navigation; the site's entire credibility rests on this | LOW | A11y | Free with disciplined markup; enforce in every Svelte component |
| Skip-link hierarchy (skip to content, skip to nav) — scope.org.uk pattern | WCAG 2.4.1 bypass blocks; first thing a keyboard user hits | LOW | A11y | Visible-on-focus, not `display:none`; target real landmark IDs |
| Keyboard operability + visible focus indicator (WCAG 2.2 Focus Appearance: ≥2px, 3:1 contrast, not obscured) | WCAG 2.1.1 / 2.4.7 / 2.4.11–13; new in 2.2 | MEDIUM | A11y | Never remove outlines; test full tab traversal per page |
| Clear services page — the four offerings (Training/Facilitation, Consulting, Modeling, Speaker/Panelist) with outcomes, not just labels | A buyer must grasp "what can I hire her for" in seconds | LOW | BOTH | Real content from live site; outcome-led copy ("what your org gets") |
| Obvious, repeated "Work with me / Book Eman" CTA | Primary conversion action; event planners decide fast | LOW | Conv | Persistent in header + end of every page; one canonical inquiry path |
| Accessible contact form (labels, error text tied via `aria-describedby`, no CAPTCHA cognitive test) | WCAG 3.3.1/3.3.2 + 2.2 Accessible Authentication; conversion endpoint | MEDIUM | BOTH | Static service (Formspree/Web3Forms) + `mailto:` fallback; honeypot not CAPTCHA |
| Multiple contact pathways (email `mailto:`, socials, form) — scope.org.uk pattern | Different users/orgs prefer different channels; removes friction | LOW | BOTH | Real: emanrimawi@gmail.com + FB/X/LinkedIn/IG |
| Credibility / social proof: bio with real career highlights, org affiliations, client/engagement logos | Trust is the gate to any inquiry; disability lived-experience is the differentiated authority | LOW | Conv | NYLPI, Harlem ILC, Manhattan BP training, JED Foundation, etc. |
| Testimonials with real attribution (name, role, org) | Anonymous quotes read as fabricated; attribution = proof | LOW | Conv | Gather real quotes; mark clearly if none yet available |
| Dedicated Accessibility Statement page (conformance target, known limitations, contact-for-issues, date) | For THIS site it is the headline deliverable, not boilerplate; scope.org.uk has one in nav + footer | MEDIUM | BOTH | Link in primary nav AND footer; honest, dated, names WCAG 2.2 AA target |
| Descriptive alt text on all meaningful images; empty alt on decorative | WCAG 1.1.1; a disability site with bad alt text is self-refuting | LOW | A11y | Model/portfolio photos especially — describe substance, not "image" |
| Responsive mobile-first layout with accessible collapsible nav (button, `aria-expanded`, focus trap-free) | Most event planners browse on mobile; WCAG reflow 1.4.10 | MEDIUM | BOTH | Disclosure pattern, not a hamburger that traps focus |
| Reduced-motion support via `prefers-reduced-motion` | WCAG 2.3.3 (AAA) but table-stakes for this brand; respects OS setting | LOW | A11y | Gate all transitions/animations behind the media query |
| Sufficient color contrast (4.5:1 text, 3:1 UI/large) + non-color status cues | WCAG 1.4.3 / 1.4.11 / 1.4.1 | LOW | A11y | Bake into design tokens up front; verify with automated + manual |
| Target size ≥24×24px for interactive controls (WCAG 2.2 AA, new) | New AA criterion; also helps motor-impaired + mobile | LOW | BOTH | Set min tap-target sizing in shared button/link styles |
| Accessible, captioned/transcribed media wherever video/audio appears | WCAG 1.2.2/1.2.3; also a speaker's demo reel is a core sales asset | MEDIUM | BOTH | See differentiator "Captioned demo reel"; even one video triggers this |
| Page `<title>`, `lang`, meta description, and a real favicon | Baseline discoverability + WCAG 3.1.1 language of page | LOW | BOTH | SvelteKit `<svelte:head>` per route |

### Differentiators (Competitive Advantage)

Where this site can out-class both generic speaker sites and generic consultant sites. Prioritize those marked **BOTH** — they compound the two goals.

| Feature | Value Proposition | Complexity | Serves | Notes |
|---------|-------------------|------------|--------|-------|
| **Native accessibility preferences panel** (contrast/theme, text-size, motion toggle — driven by CSS vars + `prefers-*`, persisted to `localStorage`) | The RIGHT way to give user control — unlike an overlay widget. Proves mastery by *building* access, not bolting it on | MEDIUM–HIGH | BOTH | Respect OS defaults first (`prefers-color-scheme`/`-contrast`/`-reduced-motion`), let user override. NOT a third-party overlay (see anti-features) |
| **Plain-language mode / plain-language service summaries** (scope.org.uk pattern) | Cognitive accessibility + faster buyer comprehension; the site literally demonstrates inclusive communication | MEDIUM | BOTH | Can be a per-page "In plain language" summary block rather than a full alternate site |
| **Plain-language statistics paired with icons** (scope.org.uk pattern) | Communicates impact/credibility for cognitively diverse readers AND makes proof skimmable for buyers | LOW–MEDIUM | BOTH | e.g. years of advocacy, orgs trained, engagements — real numbers only |
| **Downloadable speaker one-sheet / media kit** (PDF: headshot, 2–4 signature topics, short bio, social proof, contact) | Event planners expect a one-sheet; it's what they forward internally to decision-makers | MEDIUM | Conv | Industry-standard conversion asset; ensure the PDF itself is tagged/accessible |
| **Captioned demo reel + speaking clips** with transcripts | Planners "already watched your demo" before contact; captions serve deaf/HoH users AND autoplay-free consumption | MEDIUM | BOTH | Host on YouTube/Vimeo (their player + captions) embedded accessibly, or self-host with `<track>` |
| **Speaking/Portfolio page** with past engagements, topics ("talk menu"), and modeling portfolio | Lets a buyer self-qualify: "does her topic menu match our event?" | MEDIUM | Conv | Split professional-speaking vs modeling representation clearly |
| **Testimonials tied to specific services/engagements** | Contextual proof ("she trained our staff and…") converts far better than generic praise | LOW | Conv | Structure as a reusable component; attribution required |
| **Writing / News / Press section** (talks, articles, poetry, graphic-novel, interviews) | Establishes thought leadership + intersectional voice; feeds SEO and recurring reasons to visit | MEDIUM | Conv | Static Markdown collection in SvelteKit; start small, grow over time |
| **Intersectional positioning as the brand spine** (Black, Palestinian, woman, amputee; lived-experience authority) | This is the unique, uncopyable differentiator — authenticity is the moat | LOW | Conv | Content/IA decision more than an engineering feature; weave through Home/About |
| **"How I work / engagement process" explainer** (what booking looks like, formats, what orgs receive) | Reduces buyer uncertainty, pre-answers objections, shortens sales cycle | LOW | Conv | Also an accessibility act: sets clear expectations, reduces cognitive load |
| **Focus-visible-only styling + tested screen-reader announcements** beyond bare minimum | Demonstrates AAA-level polish that a savvy accessibility buyer will notice and respect | MEDIUM | A11y | The audience includes accessibility professionals — polish is marketing |
| **Named "book a discovery call" path** (scheduling link or clearly-scoped inquiry form) | Lowers commitment threshold vs a cold "contact us" | LOW–MEDIUM | Conv | Static-friendly scheduling link (Calendly-style) or structured form; keep accessible |

### Anti-Features (Commonly Requested, Often Problematic)

Documented to prevent scope creep and, critically, to avoid features that would *undermine* the accessibility mission.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Third-party accessibility overlay widget** (accessiBe/UserWay-style toolbar) | "One line of code makes us WCAG-compliant" | WAI/W3C reject them; they fix only 20–40% of issues, break users' own AT/browser settings, and are lawsuit magnets — FTC hit accessiBe with a $1M settlement (Jan 2025) for false compliance claims. For an *accessibility consultant* this would be actively self-discrediting | Build a **native preferences panel** + real semantic markup (see differentiators) — accessibility engineered in, not bolted on |
| **Donation / fundraising flow** | Scope.org.uk (the a11y reference) has one; disability = charity assumption | This is a consultancy, not a charity; a "donate" button reframes Eman as a cause not a professional and confuses the conversion goal. Explicitly out of scope in PROJECT.md | Single clear "Work with me / Book" CTA; monetization is bookings, not donations |
| **E-commerce (adaptive clothing store)** | It's genuinely part of Eman's work | Cart/checkout/inventory needs a backend; GitHub Pages is static; dilutes the site's job. Out of scope in PROJECT.md | Mention adaptive-clothing design as bio/portfolio credibility; link out if a store ever exists |
| **User accounts / auth / login** | "Members area," gated content | No logged-in experience is needed; adds WCAG 2.2 Accessible-Authentication burden and a backend; pure liability | Everything public; downloadable one-sheet needs no login |
| **Autoplaying media / carousels / auto-advancing sliders** | "Dynamic, modern homepage" | Violates WCAG 2.2.2 (pause/stop), causes focus traps, motion-sickness, and screen-reader chaos; the single most common a11y failure | Static hero + user-initiated video; if a gallery is needed, use a keyboard-operable, non-auto-advancing pattern |
| **Backend/server-side contact processing** | "Robust form handling, CRM, spam control" | Contradicts static-only constraint; adds ops + a11y surface | Static form service (Formspree/Web3Forms) + `mailto:` fallback + honeypot |
| **CAPTCHA on the contact form** | Spam prevention | WCAG 2.2 Accessible Authentication + 1.1.1 failures; cognitive/visual barrier at the exact conversion moment | Honeypot field + service-side spam filtering; never a puzzle/reCAPTCHA |
| **AI chatbot / live-chat widget** | "Modern engagement," mimic scope.org.uk chat | Injected widgets are frequent a11y offenders (focus, ARIA, motion), need staffing, and add third-party risk | Clear multiple contact pathways; async form + email |
| **Cookie/consent banners & heavy analytics** | "Track conversions" | Consent banners are notorious focus/keyboard traps; trackers add weight and privacy concerns | Privacy-light or cookieless analytics (e.g. Plausible-style) with no blocking banner where lawful |
| **Custom-styled video player** | Brand consistency | Rebuilding player controls almost always breaks keyboard/caption/AT support | Use YouTube/Vimeo native player or native `<video>` with `<track>` — proven accessible |
| **Domain/DNS migration off Wix** | "Finish the job" | Explicitly out of scope; a separate decision for Eman | Deploy to GitHub Pages; leave cutover as a documented handoff |

## Feature Dependencies

```
[Design tokens: color/contrast/spacing/tap-target]
    └──requires──> established BEFORE any page (contrast, target-size, focus styles derive from it)

[Semantic landmark structure]
    └──enables──> [Skip-link hierarchy]
    └──enables──> [Keyboard nav + visible focus]
    └──enables──> [Accessible collapsible nav]

[Native accessibility preferences panel]
    └──requires──> [Design tokens as CSS custom properties]
    └──requires──> [prefers-* media queries respected as defaults]

[Accessible contact form]
    └──requires──> [Static form service decision (Formspree/Web3Forms) or mailto fallback]
    └──enables──> ["Book a discovery call" path]

[Speaking/Portfolio page] ──feeds──> [Downloadable speaker one-sheet/media kit]
[Captioned demo reel] ──enhances──> [Speaking/Portfolio page] & [Home hero credibility]

[Testimonials component] ──enhances──> [Services page] & [Home] & [one-sheet]

[Accessibility Statement] ──requires──> honest audit of the built site (write LAST, keep dated)

[Writing/News section] ──requires──> [Markdown content collection setup]

[Native preferences panel] ──conflicts──> [Third-party overlay widget]  // never both; overlay is banned
[Autoplay/carousel] ──conflicts──> [WCAG 2.2.2 + reduced-motion]        // banned outright
```

### Dependency Notes

- **Design tokens first:** contrast ratios, tap-target minimums, and focus-appearance styling all inherit from tokens. Building pages before tokens guarantees rework. This is the true phase-1 root.
- **Landmarks before everything a11y:** skip links, focus order, and nav all target landmark regions; get the semantic skeleton right before styling.
- **Preferences panel depends on token-as-CSS-variables:** the panel toggles CSS custom properties; it can't exist until theming is variable-driven. It must default to the user's OS `prefers-*` settings, then allow override.
- **One-sheet depends on portfolio + testimonials content:** the PDF is a distillation of the Speaking/Portfolio and testimonial content — build the web content first, then export the kit.
- **Accessibility Statement is written last and dated:** it must honestly describe the *actual* built site (conformance level reached, any known gaps), so it depends on a real audit near launch.
- **Overlay conflicts with the whole thesis:** a native preferences panel and a third-party overlay are mutually exclusive; the overlay is banned regardless.

## MVP Definition

### Launch With (v1)

Minimum to satisfy BOTH goals — an accessible site that can actually book work.

- [ ] Design tokens (contrast-safe palette, tap-target, focus styles, reduced-motion) — foundation everything depends on
- [ ] Semantic landmark shell + skip-link hierarchy + keyboard nav + visible focus — non-negotiable a11y baseline
- [ ] Accessible collapsible mobile-first navigation — most buyers are on mobile
- [ ] Home page: intersectional positioning, value proposition, primary "Work with me" CTA
- [ ] About page: real bio, career highlights, lived-experience authority
- [ ] Services page: the four offerings, outcome-led, plain-language summaries
- [ ] Speaking/Portfolio page: engagements, topic menu, modeling representation
- [ ] Accessible contact form (static service + `mailto:` fallback) + multiple contact pathways
- [ ] Testimonials with real attribution (or a clearly-marked placeholder plan if none yet)
- [ ] Accessibility Statement page (in nav + footer, dated, WCAG 2.2 AA target) — the headline deliverable
- [ ] Correct alt text, page titles, `lang`, responsive reflow, contrast throughout

### Add After Validation (v1.x)

- [ ] Native accessibility preferences panel (theme/contrast/text-size/motion) — the flagship differentiator; add once tokens are variable-driven
- [ ] Downloadable speaker one-sheet / media kit (accessible PDF) — trigger: once portfolio + testimonial content is real and stable
- [ ] Captioned demo reel + speaking clips with transcripts — trigger: when real video assets are available
- [ ] Plain-language mode / per-page plain-language summaries — trigger: after core copy is finalized
- [ ] Plain-language statistics with icons — trigger: when real impact numbers are confirmed

### Future Consideration (v2+)

- [ ] Writing / News / Press section (Markdown collection) — defer until there's a cadence of content to publish
- [ ] "Book a discovery call" scheduling integration — defer until inquiry volume justifies it; keep static-friendly
- [ ] Multilingual / translated content — defer; only if audience demand emerges

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Design tokens (contrast/focus/tap-target/motion) | HIGH | LOW | P1 |
| Semantic landmarks + skip links + keyboard/focus | HIGH | MEDIUM | P1 |
| Services page (four offerings, outcome-led) | HIGH | LOW | P1 |
| Primary "Work with me" CTA (persistent) | HIGH | LOW | P1 |
| Accessible contact form + multiple pathways | HIGH | MEDIUM | P1 |
| Accessibility Statement page | HIGH | MEDIUM | P1 |
| Testimonials with attribution | HIGH | LOW | P1 |
| Accessible collapsible mobile nav | HIGH | MEDIUM | P1 |
| Native accessibility preferences panel | HIGH | MEDIUM-HIGH | P2 |
| Speaker one-sheet / media kit (PDF) | HIGH | MEDIUM | P2 |
| Captioned demo reel + transcripts | HIGH | MEDIUM | P2 |
| Plain-language summaries + stats | MEDIUM | MEDIUM | P2 |
| Writing / News section | MEDIUM | MEDIUM | P3 |
| Discovery-call scheduling | MEDIUM | MEDIUM | P3 |

**Priority key:** P1 = must have for launch · P2 = should have, add when possible · P3 = future consideration

## Competitor Feature Analysis

| Feature | Generic speaker site | Nonprofit advocate site (scope.org.uk) | Our Approach |
|---------|----------------------|----------------------------------------|--------------|
| Booking path | Prominent "Book me" / inquiry form | Contact + referral pathways | Single canonical "Work with me" CTA, repeated, accessible form |
| Social proof | Client logos, testimonials, demo reel | Impact stats, case stories | Attributed testimonials + plain-language impact stats + demo reel |
| Media kit | Downloadable one-sheet standard | N/A | Accessible, tagged PDF one-sheet (v1.x) |
| User access controls | Often an overlay widget (bad) | Native skip links, plain language, accessibility page | Native preferences panel + skip links + accessibility statement (never an overlay) |
| Contact pathways | Single form | Phone/email/chat, multiple channels | Email `mailto:` + socials + form (no chat widget) |
| Media | Often autoplaying hero video | Static, captioned | User-initiated, captioned, transcript-backed |
| Accessibility statement | Usually absent | Prominent in nav + footer | Prominent in nav + footer, dated, honest — headline deliverable |

## Sources

- [W3C WAI — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — new AA criteria (Focus Appearance, Focus Not Obscured, Target Size, Dragging, Accessible Authentication, Consistent Help, Redundant Entry) [HIGH]
- [W3C — WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) [HIGH]
- [Deque University — WCAG 2.2 Updates](https://dequeuniversity.com/resources/wcag-2.2/) [HIGH]
- [Level Access — WCAG 2.2 AA Checklist](https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/) [MEDIUM]
- [Accessible Web — Do Away with Overlays](https://accessibleweb.com/web-accessibility-news/do-away-with-overlays/) — WAI does not endorse overlays [HIGH]
- [Accessibility.Works — Overlay widgets attract lawsuits](https://www.accessibility.works/blog/avoid-accessibility-overlay-tools-toolbar-plugins/) — FTC accessiBe $1M settlement (Jan 2025) [MEDIUM]
- [Charles Jones — Accessibility overlays are legal risk](https://charlesjones.dev/blog/accessibility-overlays-not-wcag-compliance-legal-risk) [MEDIUM]
- [The Speaker Lab — How to create a speaker one sheet](https://thespeakerlab.com/blog/how-to-create-a-speaker-one-sheet/) — one-sheet essentials [MEDIUM]
- [Alliance Interactive — Best speaker websites](https://www.allianceinteractive.com/blog/best-speaker-websites/) — speaker site conversion features [MEDIUM]
- [SpeakerHub — Speaker one-sheet that gets you booked](https://speakerhub.com/skillcamp/creating-speaker-one-sheet-actually-gets-you-booked) [MEDIUM]
- scope.org.uk — accessibility/IA reference (skip-link hierarchy, plain-language stats, multiple contact pathways, dedicated accessibility section) [MEDIUM, observed patterns per PROJECT.md]

---
*Feature research for: accessibility-first consultant/speaker/advocate website*
*Researched: 2026-07-04*
