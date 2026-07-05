<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * Plain-language credibility stat. The value + label carry the meaning; the
	 * icon is decorative (scope.org.uk plain-language stat pattern).
	 * @type {{ value: string, label: string, icon?: string }}
	 */
	let { value, label, icon } = $props();
</script>

<div class="stat">
	{#if icon}
		<span class="stat__icon"><Icon name={icon} size={28} /></span>
	{/if}
	<p class="stat__value">{value}</p>
	<p class="stat__label">{label}</p>
</div>

<style>
	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		height: 100%;
	}
	.stat__icon {
		color: var(--color-accent);
		margin-bottom: var(--space-xs);
	}
	.stat__value {
		font-family: var(--font-heading);
		font-size: var(--step-2);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}
	.stat__label {
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
