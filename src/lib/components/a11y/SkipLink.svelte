<script>
	/**
	 * Skip link — the first focusable element on the page. Visually hidden until
	 * focused, then it appears and jumps keyboard/AT users past the header to the
	 * main content region. Targets the persistent layout `#main-content` so it
	 * survives client-side navigation.
	 * @type {{ target?: string, children?: import('svelte').Snippet }}
	 */
	let { target = '#main-content', children } = $props();
</script>

<a class="skip-link" href={target}>
	{#if children}{@render children()}{:else}Skip to main content{/if}
</a>

<style>
	.skip-link {
		position: absolute;
		left: var(--space-sm);
		top: var(--space-sm);
		z-index: 1000;
		padding: var(--space-xs) var(--space-md);
		min-height: var(--target-min);
		display: inline-flex;
		align-items: center;
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-radius: var(--radius-md);
		font-weight: 700;
		text-decoration: none;
		transform: translateY(-150%);
		transition: transform var(--motion-fast) var(--ease);
	}

	.skip-link:focus {
		transform: translateY(0);
		outline: 3px solid var(--color-focus);
		outline-offset: 2px;
	}
</style>
