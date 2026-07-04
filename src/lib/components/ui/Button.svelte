<script>
	/**
	 * Button / link with a shared, accessible visual treatment.
	 * Renders a real <button> unless `href` is given, in which case it renders an
	 * <a> styled as a button (pass an already-resolved href for internal routes).
	 *
	 * @type {{
	 *   href?: string,
	 *   variant?: 'primary' | 'secondary' | 'ghost',
	 *   size?: 'md' | 'lg',
	 *   type?: 'button' | 'submit' | 'reset',
	 *   external?: boolean,
	 *   full?: boolean,
	 *   children: import('svelte').Snippet,
	 *   [key: string]: unknown
	 * }}
	 */
	let {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		external = false,
		full = false,
		children,
		...rest
	} = $props();
</script>

{#if href}
	<a
		{href}
		class="button"
		class:button--primary={variant === 'primary'}
		class:button--secondary={variant === 'secondary'}
		class:button--ghost={variant === 'ghost'}
		class:button--lg={size === 'lg'}
		class:button--full={full}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{...rest}
	>
		{@render children()}
		{#if external}<span class="visually-hidden"> (opens in a new tab)</span>{/if}
	</a>
{:else}
	<button
		{type}
		class="button"
		class:button--primary={variant === 'primary'}
		class:button--secondary={variant === 'secondary'}
		class:button--ghost={variant === 'ghost'}
		class:button--lg={size === 'lg'}
		class:button--full={full}
		{...rest}
	>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		min-height: var(--target-min);
		padding-inline: var(--space-lg);
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--step-0);
		line-height: 1.2;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color var(--motion-fast) var(--ease),
			border-color var(--motion-fast) var(--ease),
			color var(--motion-fast) var(--ease);
	}

	.button--lg {
		font-size: var(--step-1);
		padding-inline: var(--space-xl);
		min-height: calc(var(--target-min) + 0.5rem);
	}

	.button--full {
		width: 100%;
	}

	.button--primary {
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}
	.button--primary:hover {
		background: var(--color-primary-hover);
		border-color: var(--color-primary-hover);
	}

	.button--secondary {
		background: transparent;
		color: var(--color-primary);
		border-color: var(--color-primary);
	}
	.button--secondary:hover {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}

	.button--ghost {
		background: transparent;
		color: var(--color-link);
		border-color: transparent;
		padding-inline: var(--space-sm);
	}
	.button--ghost:hover {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	@media (forced-colors: active) {
		.button {
			border-color: currentColor;
		}
	}
</style>
