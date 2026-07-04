<script>
	/**
	 * Accessible form field: a real <label> bound to the control, optional help
	 * text and error message wired through aria-describedby, and aria-invalid on
	 * error. Supports single-line inputs and textarea.
	 *
	 * @type {{
	 *   id: string,
	 *   label: string,
	 *   value?: string,
	 *   type?: string,
	 *   name?: string,
	 *   required?: boolean,
	 *   autocomplete?: import('svelte/elements').FullAutoFill,
	 *   description?: string,
	 *   error?: string,
	 *   textarea?: boolean,
	 *   rows?: number,
	 *   [key: string]: unknown
	 * }}
	 */
	let {
		id,
		label,
		value = $bindable(''),
		type = 'text',
		name = id,
		required = false,
		autocomplete,
		description,
		error,
		textarea = false,
		rows = 5,
		...rest
	} = $props();

	let descId = $derived(description ? `${id}-desc` : undefined);
	let errId = $derived(error ? `${id}-error` : undefined);
	let describedBy = $derived([descId, errId].filter(Boolean).join(' ') || undefined);
</script>

<div class="field" class:field--error={error}>
	<label class="field__label" for={id}>
		{label}
		{#if required}<span class="field__required" aria-hidden="true">*</span><span
				class="visually-hidden"
			>
				(required)</span
			>{/if}
	</label>

	{#if description}
		<p class="field__desc" id={descId}>{description}</p>
	{/if}

	{#if textarea}
		<textarea
			{id}
			{name}
			{rows}
			{required}
			bind:value
			aria-describedby={describedBy}
			aria-invalid={error ? 'true' : undefined}
			{...rest}
		></textarea>
	{:else}
		<input
			{id}
			{name}
			{type}
			{required}
			{autocomplete}
			bind:value
			aria-describedby={describedBy}
			aria-invalid={error ? 'true' : undefined}
			{...rest}
		/>
	{/if}

	{#if error}
		<p class="field__error" id={errId}>
			<span class="visually-hidden">Error: </span>{error}
		</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		margin-bottom: var(--space-lg);
	}

	.field__label {
		font-weight: 700;
	}
	.field__required {
		color: var(--color-error);
		margin-inline-start: 0.15em;
	}

	.field__desc {
		color: var(--color-text-muted);
		font-size: var(--step--1);
		margin: 0;
	}

	input,
	textarea {
		width: 100%;
		min-height: var(--target-min);
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface);
		color: var(--color-text);
		border: 2px solid var(--color-border-strong);
		border-radius: var(--radius-md);
	}
	textarea {
		resize: vertical;
	}

	input:hover,
	textarea:hover {
		border-color: var(--color-primary);
	}

	.field--error input,
	.field--error textarea {
		border-color: var(--color-error);
	}

	.field__error {
		color: var(--color-error);
		font-weight: 700;
		margin: 0;
	}
</style>
