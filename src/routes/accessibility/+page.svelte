<script>
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { site } from '$lib/content/site.js';

	const updated = '4 July 2026';
</script>

<svelte:head>
	<title>Accessibility statement — Diversity Includes Disability</title>
	<meta
		name="description"
		content="Accessibility statement for the Diversity Includes Disability website — our WCAG 2.2 AA conformance target, testing approach, and how to give feedback."
	/>
</svelte:head>

<PageHeader
	eyebrow="Accessibility"
	title="Accessibility statement"
	intro="Accessibility isn’t a feature of this site — it’s the point. Here’s exactly where we stand."
/>

<div class="section">
	<div class="container prose">
		<p class="updated">Last reviewed: {updated}</p>

		<h2>Our commitment</h2>
		<p>
			Diversity Includes Disability exists to make the world more accessible, so this website is
			held to the same standard we ask of everyone else. We aim to meet — and, where we can, exceed
			— the <strong>Web Content Accessibility Guidelines (WCAG) 2.2, Level AA</strong>.
		</p>

		<h2>What we’ve built in</h2>
		<ul>
			<li>Semantic HTML with clear landmark regions and a logical heading order.</li>
			<li>A visible “skip to main content” link and keyboard access to every feature.</li>
			<li>
				Focus moves to the main content on each page change, so keyboard and screen-reader users are
				never stranded.
			</li>
			<li>Strong, visible focus outlines that meet WCAG 2.2 Focus Appearance.</li>
			<li>
				Colour contrast that meets AA everywhere, with body text meeting the stricter AAA ratio.
			</li>
			<li>Support for <em>reduced motion</em> and Windows High Contrast / forced-colours modes.</li>
			<li>
				Highly legible, self-hosted fonts (Atkinson Hyperlegible and Lexend) with no third-party
				requests.
			</li>
			<li>Touch targets of at least 44×44 pixels, comfortably above the minimum.</li>
			<li>
				Form fields with real labels, clear error messages announced to assistive technology, and
				focus sent to the first problem.
			</li>
		</ul>

		<h2>How we test</h2>
		<p>We check accessibility continuously, not just at launch:</p>
		<ul>
			<li>
				<strong>Automated:</strong> axe-core and pa11y run against every page, plus a custom colour-contrast
				check and the Svelte accessibility compiler — all wired into our build.
			</li>
			<li>
				<strong>Manual:</strong> keyboard-only walkthroughs and screen-reader passes, because automated
				tools catch only a portion of real barriers.
			</li>
		</ul>

		<h2>Known limitations</h2>
		<p>We’d rather be honest than overclaim. As of {updated}:</p>
		<ul>
			<li>Some photography is still a placeholder while authentic images are prepared.</li>
			<li>
				Links to external social platforms open in a new tab (clearly labelled) and are governed by
				those platforms’ own accessibility.
			</li>
		</ul>

		<h2>Tell us if something isn’t working</h2>
		<p>
			If you hit a barrier on this site, or you need information here in a different format, please
			get in touch — we treat accessibility feedback as a priority.
		</p>
		<p>
			Email <a href="mailto:{site.email}">{site.email}</a>, or use the
			<a href="../contact/">contact form</a>. We aim to respond promptly and to fix issues as
			quickly as we can.
		</p>
	</div>
</div>

<style>
	.section {
		padding-block: var(--space-2xl) var(--space-3xl);
	}
	.prose {
		max-width: var(--width-prose);
	}
	.prose h2 {
		font-size: var(--step-2);
		margin-top: var(--space-xl);
		margin-bottom: var(--space-sm);
	}
	.prose p,
	.prose li {
		font-size: var(--step-0);
	}
	.prose ul {
		padding-left: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.updated {
		color: var(--color-text-muted);
		font-style: italic;
	}
</style>
