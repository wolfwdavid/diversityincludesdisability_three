<script>
	import { onMount, tick } from 'svelte';
	import { options, defaults, applyPrefs, loadPrefs, savePrefs } from '$lib/prefs.js';
	import Icon from '$lib/components/ui/Icon.svelte';

	let open = $state(false);
	let prefs = $state({ ...defaults });
	/** @type {HTMLButtonElement | undefined} */
	let triggerEl = $state();
	/** @type {HTMLDivElement | undefined} */
	let panelEl = $state();

	onMount(() => {
		prefs = loadPrefs();
		applyPrefs(prefs);
	});

	function update() {
		applyPrefs(prefs);
		savePrefs(prefs);
	}

	function reset() {
		prefs = { ...defaults };
		update();
	}

	async function openPanel() {
		open = true;
		await tick();
		// Focus the first control for keyboard users.
		panelEl?.querySelector('input')?.focus();
	}

	function close(returnFocus = true) {
		open = false;
		if (returnFocus) triggerEl?.focus();
	}

	/** @param {KeyboardEvent} e */
	function onKeydown(e) {
		if (e.key === 'Escape' && open) {
			e.stopPropagation();
			close();
		}
	}

	/** @param {MouseEvent} e */
	function onWindowClick(e) {
		if (!open) return;
		const t = /** @type {Node} */ (e.target);
		if (panelEl && !panelEl.contains(t) && triggerEl && !triggerEl.contains(t)) close(false);
	}
</script>

<svelte:window onkeydown={onKeydown} onclick={onWindowClick} />

<div class="prefs">
	<button
		class="prefs__trigger"
		type="button"
		aria-expanded={open}
		aria-controls="prefs-panel"
		bind:this={triggerEl}
		onclick={() => (open ? close() : openPanel())}
	>
		<Icon name="compass" size={20} />
		<span>Accessibility</span>
	</button>

	{#if open}
		<div
			class="prefs__panel"
			id="prefs-panel"
			bind:this={panelEl}
			role="group"
			aria-label="Accessibility preferences"
		>
			<div class="prefs__head">
				<h2 class="prefs__title">Accessibility preferences</h2>
				<button class="prefs__close" type="button" onclick={() => close()}>
					<Icon name="arrow-right" size={18} /><span class="visually-hidden">Close preferences</span
					>
				</button>
			</div>
			<p class="prefs__hint">
				These settings layer over your device settings and are saved on this device.
			</p>

			<fieldset class="prefs__group prefs__group--mode">
				<legend>Display mode</legend>
				{#each options.mode as opt (opt.value)}
					<label class="prefs__option">
						<input
							type="radio"
							name="pref-mode"
							value={opt.value}
							bind:group={prefs.mode}
							onchange={update}
						/>
						<span>{opt.label}</span>
					</label>
				{/each}
				<p class="prefs__mode-note">
					Accessibility mode meets WCAG&nbsp;2.2&nbsp;AA: solid colours, no 3D or motion.
				</p>
			</fieldset>

			{#if prefs.mode === 'accessible'}
				<fieldset class="prefs__group">
					<legend>Theme</legend>
					{#each options.theme as opt (opt.value)}
						<label class="prefs__option">
							<input
								type="radio"
								name="pref-theme"
								value={opt.value}
								bind:group={prefs.theme}
								onchange={update}
							/>
							<span>{opt.label}</span>
						</label>
					{/each}
				</fieldset>
			{/if}

			<fieldset class="prefs__group">
				<legend>Text size</legend>
				{#each options.textSize as opt (opt.value)}
					<label class="prefs__option">
						<input
							type="radio"
							name="pref-text"
							value={opt.value}
							bind:group={prefs.textSize}
							onchange={update}
						/>
						<span>{opt.label}</span>
					</label>
				{/each}
			</fieldset>

			<fieldset class="prefs__group">
				<legend>Motion</legend>
				{#each options.motion as opt (opt.value)}
					<label class="prefs__option">
						<input
							type="radio"
							name="pref-motion"
							value={opt.value}
							bind:group={prefs.motion}
							onchange={update}
						/>
						<span>{opt.label}</span>
					</label>
				{/each}
			</fieldset>

			<button class="prefs__reset" type="button" onclick={reset}>Reset to defaults</button>
		</div>
	{/if}
</div>

<style>
	.prefs {
		position: relative;
	}

	.prefs__trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		min-height: var(--target-min);
		padding-inline: var(--space-sm);
		background: transparent;
		border: 2px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-weight: 600;
		cursor: pointer;
	}
	.prefs__trigger:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.prefs__panel {
		position: absolute;
		right: 0;
		top: calc(100% + var(--space-2xs));
		z-index: 60;
		width: min(20rem, 90vw);
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
	}

	.prefs__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
	}
	.prefs__title {
		font-size: var(--step-1);
		margin: 0;
	}
	.prefs__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--target-min);
		min-height: var(--target-min);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		cursor: pointer;
		rotate: 90deg;
	}
	.prefs__hint {
		margin: var(--space-xs) 0 var(--space-md);
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}

	.prefs__group {
		border: 0;
		padding: 0;
		margin: 0 0 var(--space-md);
	}
	.prefs__group--mode {
		padding: var(--space-sm) var(--space-md);
		margin-bottom: var(--space-lg);
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
	}
	.prefs__mode-note {
		margin: var(--space-2xs) 0 0;
		font-size: var(--step--1);
		color: var(--color-text-muted);
	}
	.prefs__group legend {
		font-weight: 700;
		padding: 0;
		margin-bottom: var(--space-2xs);
	}
	.prefs__option {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--target-min);
		cursor: pointer;
	}
	.prefs__option input {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--color-primary);
	}

	.prefs__reset {
		width: 100%;
		min-height: var(--target-min);
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-weight: 600;
		cursor: pointer;
	}
	.prefs__reset:hover {
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}
</style>
