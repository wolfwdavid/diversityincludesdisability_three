<script>
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';

	/**
	 * Repeating conversion band. Placed at the foot of every content page so a
	 * "work with Eman" path is always one action away.
	 * @type {{ heading?: string, text?: string }}
	 */
	let {
		heading = 'Build access into your work.',
		text = 'Bring intersectional disability equity to your team, event, or campaign.'
	} = $props();
</script>

<section class="cta">
	<div class="container cta__inner">
		<div>
			<h2 class="cta__heading">{heading}</h2>
			<p class="cta__text">{text}</p>
		</div>
		<div class="cta__actions">
			<Button href="{base}/contact/" variant="primary" size="lg">Work with Eman</Button>
			<Button href="{base}/services/" variant="secondary">Explore services</Button>
		</div>
	</div>
</section>

<style>
	.cta {
		background: var(--color-surface-invert);
		color: var(--color-text-invert);
		padding-block: var(--space-2xl);
	}
	.cta__inner {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xl);
		align-items: center;
		justify-content: space-between;
	}
	.cta__heading {
		font-size: var(--step-3);
		max-width: 20ch;
	}
	.cta__text {
		margin-top: var(--space-sm);
		color: var(--color-text-invert);
		opacity: 0.92;
		max-width: 42ch;
	}
	.cta__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
	/* Secondary button sits on a dark band — invert its colours here */
	.cta :global(.button--secondary) {
		color: var(--color-text-invert);
		border-color: var(--color-text-invert);
	}
	.cta :global(.button--secondary:hover) {
		background: var(--color-text-invert);
		color: var(--color-surface-invert);
	}
</style>
