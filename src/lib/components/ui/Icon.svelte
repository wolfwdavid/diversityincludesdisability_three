<script>
	/**
	 * Inline line icons. Decorative by default (aria-hidden) — the accessible
	 * name always comes from adjacent visible text, never the icon alone.
	 * @type {{ name: string, size?: number }}
	 */
	let { name, size = 24 } = $props();
</script>

<svg
	class="icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	{#if name === 'people'}
		<circle cx="9" cy="8" r="3" />
		<path d="M3 20a6 6 0 0 1 12 0" />
		<path d="M16 5.5a3 3 0 0 1 0 5.5M21 20a6 6 0 0 0-4-5.6" />
	{:else if name === 'compass'}
		<circle cx="12" cy="12" r="9" />
		<path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
	{:else if name === 'camera'}
		<path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
		<circle cx="12" cy="13" r="3.5" />
	{:else if name === 'mic'}
		<rect x="9" y="3" width="6" height="11" rx="3" />
		<path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
	{:else if name === 'transit'}
		<rect x="5" y="4" width="14" height="12" rx="2" />
		<path d="M5 11h14M8 20l1.5-4M16 20l-1.5-4" />
		<circle cx="8.5" cy="13.5" r="0.6" fill="currentColor" />
		<circle cx="15.5" cy="13.5" r="0.6" fill="currentColor" />
	{:else if name === 'building'}
		<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 10h4a1 1 0 0 1 1 1v10" />
		<path d="M8 8h3M8 12h3M8 16h3" />
	{:else if name === 'scale'}
		<path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 5a3 3 0 0 0 5 0zM19 7l-2.5 5a3 3 0 0 0 5 0z" />
	{:else if name === 'arrow-right'}
		<path d="M5 12h14M13 6l6 6-6 6" />
	{:else if name === 'mail'}
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3 7 9 6 9-6" />
	{:else if name === 'check'}
		<path d="M20 6 9 17l-5-5" />
	{/if}
</svg>

<style>
	.icon {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: middle;
	}
</style>
