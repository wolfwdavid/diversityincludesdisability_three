<script>
	/**
	 * Renders content that is invisible on screen but available to screen readers.
	 * Use for extra labelling context (e.g. "opens in a new tab").
	 * @type {{ as?: string, children: import('svelte').Snippet }}
	 */
	let { as = 'span', children } = $props();
</script>

<svelte:element this={as} class="visually-hidden">{@render children()}</svelte:element>
