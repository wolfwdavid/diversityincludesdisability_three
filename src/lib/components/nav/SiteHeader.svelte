<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { navItems, site } from '$lib/content/site.js';

	let open = $state(false);
	/** @type {HTMLButtonElement | undefined} */
	let toggleEl = $state();

	/**
	 * Is this nav item the current page? (trailing-slash tolerant)
	 * @param {string} href
	 */
	function isCurrent(href) {
		/** @param {string} p */
		const strip = (p) => p.replace(/\/+$/, '');
		return strip(page.url.pathname) === strip(base + href);
	}

	function close(returnFocus = false) {
		open = false;
		if (returnFocus) toggleEl?.focus();
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Escape' && open) {
			event.stopPropagation();
			close(true);
		}
	}

	// Collapse the mobile menu after navigating to a new route.
	afterNavigate(() => {
		open = false;
	});
</script>

<svelte:window onkeydown={onKeydown} />

<header class="site-header">
	<div class="container site-header__inner">
		<a class="site-header__brand" href="{base}/">
			<span class="site-header__brand-name">{site.name}</span>
		</a>

		<button
			class="site-header__toggle"
			type="button"
			aria-expanded={open}
			aria-controls="primary-navigation"
			bind:this={toggleEl}
			onclick={() => (open = !open)}
		>
			<svg class="site-header__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				{#if open}
					<path
						d="M6 6l12 12M18 6L6 18"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				{:else}
					<path
						d="M3 6h18M3 12h18M3 18h18"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				{/if}
			</svg>
			<span>Menu</span>
		</button>

		<nav id="primary-navigation" class="site-header__nav" class:is-open={open} aria-label="Primary">
			<ul class="site-header__list">
				{#each navItems as item (item.href)}
					<li>
						<a
							class="site-header__link"
							href="{base}{item.href}"
							aria-current={isCurrent(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}

	.site-header__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		min-height: var(--target-min);
		padding-block: var(--space-sm);
	}

	.site-header__brand {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--step-1);
		color: var(--color-text);
		text-decoration: none;
		line-height: 1.1;
	}
	.site-header__brand:hover .site-header__brand-name {
		color: var(--color-primary);
	}

	/* Toggle: shown on small screens only */
	.site-header__toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		min-height: var(--target-min);
		padding-inline: var(--space-sm);
		background: transparent;
		border: 2px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-weight: 700;
		cursor: pointer;
	}
	.site-header__icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	.site-header__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.site-header__link {
		display: flex;
		align-items: center;
		min-height: var(--target-min);
		padding-inline: var(--space-md);
		border-radius: var(--radius-md);
		color: var(--color-text);
		text-decoration: none;
		font-weight: 600;
	}
	.site-header__link:hover {
		background: var(--color-surface-alt);
		color: var(--color-primary);
	}
	.site-header__link[aria-current='page'] {
		color: var(--color-primary);
		box-shadow: inset 0 -3px 0 var(--color-accent);
	}

	/* Mobile: nav collapses; toggle controls it */
	.site-header__nav {
		flex-basis: 100%;
		display: none;
	}
	.site-header__nav.is-open {
		display: block;
		padding-block: var(--space-sm);
	}

	/* Desktop: nav always visible inline, toggle hidden */
	@media (min-width: 48rem) {
		.site-header__toggle {
			display: none;
		}
		.site-header__nav {
			flex-basis: auto;
			display: block;
		}
		.site-header__list {
			flex-direction: row;
			gap: var(--space-2xs);
		}
	}
</style>
