<script>
	/**
	 * Consistent page masthead: the single <h1> plus an optional intro line and
	 * eyebrow. Every content page uses exactly one of these.
	 * @type {{
	 *   title: string,
	 *   eyebrow?: string,
	 *   intro?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { title, eyebrow, intro, children } = $props();
</script>

<header class="page-header">
	<div class="container">
		{#if eyebrow}<p class="page-header__eyebrow">{eyebrow}</p>{/if}
		<h1>{title}</h1>
		{#if intro}<p class="page-header__intro">{intro}</p>{/if}
		{#if children}<div class="page-header__actions">{@render children()}</div>{/if}
	</div>
</header>

<style>
	.page-header {
		padding-block: var(--space-2xl) var(--space-xl);
		background: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
	}
	.page-header__eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: var(--color-accent);
		margin-bottom: var(--space-xs);
	}
	.page-header__intro {
		margin-top: var(--space-md);
		font-size: var(--step-1);
		color: var(--color-text-muted);
		max-width: var(--width-prose);
	}
	.page-header__actions {
		margin-top: var(--space-lg);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
</style>
