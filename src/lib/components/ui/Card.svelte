<script>
	/**
	 * Content card with a configurable heading level so the document outline
	 * stays correct wherever the card is used (WCAG 1.3.1). Optionally links the
	 * whole card via an accessible title link (the rest of the card is not a
	 * nested interactive element).
	 *
	 * @type {{
	 *   title?: string,
	 *   href?: string,
	 *   headingLevel?: 2 | 3 | 4,
	 *   eyebrow?: string,
	 *   children?: import('svelte').Snippet,
	 *   actions?: import('svelte').Snippet
	 * }}
	 */
	let { title, href, headingLevel = 3, eyebrow, children, actions } = $props();
	let Heading = $derived(`h${headingLevel}`);
</script>

<article class="card">
	{#if eyebrow}<p class="card__eyebrow">{eyebrow}</p>{/if}
	{#if title}
		<svelte:element this={Heading} class="card__title">
			{#if href}<a class="card__link" {href}>{title}</a>{:else}{title}{/if}
		</svelte:element>
	{/if}
	{#if children}<div class="card__body">{@render children()}</div>{/if}
	{#if actions}<div class="card__actions">{@render actions()}</div>{/if}
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		height: 100%;
	}

	.card__eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: var(--step--1);
		font-weight: 700;
		color: var(--color-accent);
		margin: 0;
	}

	.card__title {
		font-size: var(--step-2);
		margin: 0;
	}

	.card__link {
		color: inherit;
		text-decoration: none;
	}
	.card__link:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	/* Expand the link's hit area across the card while keeping text selectable */
	.card__link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.card {
		position: relative;
	}

	.card__body {
		color: var(--color-text);
	}

	.card__actions {
		margin-top: auto;
		padding-top: var(--space-sm);
	}
</style>
