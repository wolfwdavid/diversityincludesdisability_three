<script>
	/**
	 * Branded placeholder for a real photograph of Eman. Decorative (aria-hidden)
	 * so it never asserts false alt text. Replace with a real <img alt="…"> once
	 * authentic photography is available — do NOT substitute disability stock.
	 * @type {{ ratio?: string, label?: string }}
	 */
	let { ratio = '4 / 5', label = 'Photograph of Eman' } = $props();
</script>

<div class="portrait" style="aspect-ratio: {ratio}" aria-hidden="true">
	<svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" role="presentation">
		<rect width="100" height="125" fill="var(--color-surface-alt)" />
		<circle cx="50" cy="48" r="20" fill="var(--plum-200)" />
		<path d="M18 125c0-20 14-34 32-34s32 14 32 34z" fill="var(--plum-200)" />
	</svg>
	<span class="portrait__tag">{label} — photo to be added</span>
</div>

<style>
	.portrait {
		position: relative;
		width: 100%;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-surface-alt);
	}
	.portrait svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.portrait__tag {
		position: absolute;
		left: var(--space-sm);
		bottom: var(--space-sm);
		padding: var(--space-2xs) var(--space-xs);
		font-size: var(--step--1);
		background: var(--color-surface);
		color: var(--color-text-muted);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}
</style>
