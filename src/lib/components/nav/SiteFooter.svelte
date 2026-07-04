<script>
	import { base } from '$app/paths';
	import { navItems, socials, site } from '$lib/content/site.js';

	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="container site-footer__grid">
		<div class="site-footer__brand">
			<p class="site-footer__name">{site.name}</p>
			<p class="site-footer__tagline">{site.tagline}</p>
			<p>
				<a href="mailto:{site.email}">{site.email}</a>
			</p>
		</div>

		<nav class="site-footer__nav" aria-label="Footer">
			<h2 class="site-footer__heading">Explore</h2>
			<ul>
				<li><a href="{base}/">Home</a></li>
				{#each navItems as item (item.href)}
					<li><a href="{base}{item.href}">{item.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div class="site-footer__social">
			<h2 class="site-footer__heading">Connect</h2>
			<ul>
				{#each socials as s (s.href)}
					<li>
						<a href={s.href} target="_blank" rel="noopener noreferrer">
							{s.label}<span class="visually-hidden"> (opens in a new tab)</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="container site-footer__legal">
		<p>&copy; {year} {site.person} · {site.name}</p>
		<p><a href="{base}/accessibility/">Accessibility statement</a></p>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: var(--space-3xl);
		padding-block: var(--space-2xl) var(--space-xl);
		background: var(--color-surface-invert);
		color: var(--color-text-invert);
	}

	.site-footer :global(a) {
		color: var(--color-text-invert);
		text-underline-offset: 0.2em;
	}
	.site-footer :global(a:hover) {
		color: var(--color-accent);
	}

	.site-footer__grid {
		display: grid;
		gap: var(--space-xl);
		grid-template-columns: 1fr;
	}
	@media (min-width: 48rem) {
		.site-footer__grid {
			grid-template-columns: 2fr 1fr 1fr;
		}
	}

	.site-footer__name {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--step-1);
	}
	.site-footer__tagline {
		color: var(--color-text-invert);
		opacity: 0.9;
		margin-block: var(--space-xs) var(--space-sm);
		max-width: 36ch;
	}

	.site-footer__heading {
		font-size: var(--step-0);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: var(--space-sm);
	}

	.site-footer__nav ul,
	.site-footer__social ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.site-footer__nav li a,
	.site-footer__social li a {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-min);
	}

	.site-footer__legal {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-top: var(--space-xl);
		padding-top: var(--space-lg);
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		font-size: var(--step--1);
	}
</style>
