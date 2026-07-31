<script>
	import { tick } from 'svelte';
	import { env } from '$env/dynamic/public';
	import Button from '$lib/components/ui/Button.svelte';

	/** @type {{ compact?: boolean }} */
	let { compact = false } = $props();

	let email = $state('');
	let status = $state(/** @type {'idle' | 'submitting' | 'success' | 'error'} */ ('idle'));
	let errorMsg = $state('');
	/** @type {HTMLDivElement | undefined} */
	let statusEl = $state();

	const WEB3FORMS_KEY = env.PUBLIC_WEB3FORMS_KEY;
	const keyConfigured = WEB3FORMS_KEY && WEB3FORMS_KEY !== 'your-web3forms-access-key';

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const trimmed = email.trim();
		if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
			errorMsg = 'Please enter a valid email address.';
			status = 'error';
			await tick();
			statusEl?.focus();
			return;
		}

		if (!keyConfigured) {
			// Fallback: open mailto
			window.location.href = `mailto:emanrimawi@gmail.com?subject=Newsletter%20signup&body=Please%20add%20me%20to%20the%20newsletter:%20${encodeURIComponent(trimmed)}`;
			return;
		}

		status = 'submitting';
		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					access_key: WEB3FORMS_KEY,
					subject: 'Newsletter signup',
					email: trimmed,
					from_name: 'Newsletter Subscriber',
					message: `New newsletter signup: ${trimmed}`
				})
			});
			const data = await res.json();
			status = data.success ? 'success' : 'error';
			if (!data.success) errorMsg = 'Something went wrong — please try again.';
		} catch {
			status = 'error';
			errorMsg = 'Could not connect — please try again later.';
		}
		await tick();
		statusEl?.focus();
	}
</script>

<div class="newsletter" class:newsletter--compact={compact}>
	<div class="newsletter__text">
		<h2 class="newsletter__heading">Stay connected</h2>
		<p class="newsletter__desc">
			Get updates on disability equity, upcoming events, and new resources from Eman.
		</p>
	</div>

	<div class="newsletter__form-wrap" aria-live="polite" bind:this={statusEl}>
		{#if status === 'success'}
			<p class="newsletter__success" tabindex="-1">
				You're signed up — thank you!
			</p>
		{:else}
			<form class="newsletter__form" novalidate onsubmit={handleSubmit}>
				<!-- Honeypot -->
				<label class="visually-hidden">
					Leave empty if human
					<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" />
				</label>

				<div class="newsletter__field-group">
					<label for="newsletter-email" class="visually-hidden">Email address</label>
					<input
						id="newsletter-email"
						type="email"
						placeholder="Your email address"
						bind:value={email}
						required
						autocomplete="email"
						aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
					/>
					<Button type="submit" variant="primary" size="md">
						{status === 'submitting' ? 'Signing up…' : 'Subscribe'}
					</Button>
				</div>
				{#if status === 'error' && errorMsg}
					<p id="newsletter-error" class="newsletter__error" role="alert">{errorMsg}</p>
				{/if}
			</form>
		{/if}
	</div>
</div>

<style>
	.newsletter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-lg);
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xl) var(--space-xl);
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	.newsletter--compact {
		padding: var(--space-lg);
		border: none;
		border-radius: 0;
		background: transparent;
	}
	.newsletter--compact .newsletter__heading {
		font-size: var(--step-0);
	}
	.newsletter--compact .newsletter__desc {
		font-size: var(--step--1);
	}

	.newsletter__heading {
		font-size: var(--step-2);
		margin: 0;
	}
	.newsletter__desc {
		margin-top: var(--space-xs);
		color: var(--color-text-muted);
		max-width: 38ch;
	}

	.newsletter__form {
		width: 100%;
		max-width: 26rem;
	}
	.newsletter__field-group {
		display: flex;
		gap: var(--space-sm);
	}
	.newsletter__field-group input[type='email'] {
		flex: 1;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--step-0);
		font-family: inherit;
		background: var(--color-surface);
		color: var(--color-text);
	}
	.newsletter__field-group input[type='email']:focus {
		outline: 3px solid var(--color-focus);
		outline-offset: 2px;
		border-color: var(--color-primary);
	}

	.newsletter__error {
		margin-top: var(--space-xs);
		color: var(--color-error);
		font-size: var(--step--1);
	}

	.newsletter__success {
		font-weight: 600;
		color: var(--color-success, #1a7f4b);
	}

	/* Dark-background variant (inside footer) */
	.newsletter--compact .newsletter__desc,
	.newsletter--compact .newsletter__heading {
		color: inherit;
	}
	.newsletter--compact input[type='email'] {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
		color: inherit;
	}
	.newsletter--compact input[type='email']::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}
</style>
