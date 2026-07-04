<script>
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<header class="site-header">
	<div class="container site-header__inner">
		<a class="site-header__brand" href={resolve('/')}>Diversity Includes Disability</a>
	</div>
</header>

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="container">
		<p>&copy; {new Date().getFullYear()} Eman Rimawi-Doster · Diversity Includes Disability</p>
	</div>
</footer>

<style>
	.skip-link {
		position: absolute;
		left: var(--space-sm);
		top: var(--space-sm);
		z-index: 100;
		padding: var(--space-xs) var(--space-md);
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-radius: var(--radius-md);
		text-decoration: none;
		transform: translateY(-150%);
		transition: transform var(--motion-fast) var(--ease);
	}

	.skip-link:focus {
		transform: translateY(0);
	}

	.site-header {
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.site-header__inner {
		display: flex;
		align-items: center;
		min-height: var(--target-min);
		padding-block: var(--space-md);
	}

	.site-header__brand {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--step-1);
		color: var(--color-text);
		text-decoration: none;
	}

	main {
		display: block;
	}

	.site-footer {
		margin-top: var(--space-3xl);
		padding-block: var(--space-xl);
		border-top: 1px solid var(--color-border);
		background: var(--color-surface-alt);
		color: var(--color-text-muted);
	}
</style>
