<script>
	import { tick } from 'svelte';
	import { env } from '$env/dynamic/public';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Field from '$lib/components/forms/Field.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { site, socials } from '$lib/content/site.js';

	const values = $state({ name: '', email: '', organization: '', message: '' });
	let errors = $state(/** @type {Record<string, string>} */ ({}));
	let status = $state(
		/** @type {'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'} */ ('idle')
	);
	/** @type {HTMLDivElement | undefined} */
	let summaryEl = $state();

	const WEB3FORMS_KEY = env.PUBLIC_WEB3FORMS_KEY;
	const keyConfigured = WEB3FORMS_KEY && WEB3FORMS_KEY !== 'your-web3forms-access-key';

	function validate() {
		/** @type {Record<string, string>} */
		const e = {};
		if (!values.name.trim()) e.name = 'Please enter your name.';
		if (!values.email.trim()) e.email = 'Please enter your email address.';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
			e.email = 'Please enter a valid email address (like name@example.com).';
		if (!values.message.trim()) e.message = 'Please tell Eman a little about your enquiry.';
		return e;
	}

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const found = validate();
		errors = found;
		if (Object.keys(found).length > 0) {
			status = 'idle';
			await tick();
			summaryEl?.focus();
			return;
		}

		if (!keyConfigured) {
			// Online form not yet wired to a Web3Forms key — direct to email.
			status = 'unconfigured';
			await tick();
			summaryEl?.focus();
			return;
		}

		status = 'submitting';
		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					access_key: WEB3FORMS_KEY,
					subject: `New enquiry from ${values.name}`,
					name: values.name,
					email: values.email,
					organization: values.organization,
					message: values.message
				})
			});
			const data = await res.json();
			status = data.success ? 'success' : 'error';
		} catch {
			status = 'error';
		}
		await tick();
		summaryEl?.focus();
	}
</script>

<svelte:head>
	<title>Contact — Diversity Includes Disability</title>
	<meta
		name="description"
		content="Get in touch to book Eman Rimawi-Doster for training, consulting, speaking, or modeling."
	/>
</svelte:head>

<PageHeader
	eyebrow="Contact"
	title="Get in touch"
	intro="Tell Eman about your team, event, or campaign. She’ll reply personally."
/>

<div class="section">
	<div class="container contact">
		<div class="contact__form-col">
			<!-- Status region: announced to assistive tech -->
			<div class="status" aria-live="polite">
				{#if status === 'success'}
					<div class="alert alert--success" tabindex="-1" bind:this={summaryEl}>
						<h2>Thank you — your message is on its way.</h2>
						<p>
							Eman will get back to you soon. Prefer email? Write to <a href="mailto:{site.email}"
								>{site.email}</a
							>.
						</p>
					</div>
				{:else if status === 'error'}
					<div class="alert alert--error" role="alert" tabindex="-1" bind:this={summaryEl}>
						<h2>Something went wrong sending your message.</h2>
						<p>
							Please try again, or email <a href="mailto:{site.email}">{site.email}</a> directly.
						</p>
					</div>
				{:else if status === 'unconfigured'}
					<div class="alert alert--info" role="alert" tabindex="-1" bind:this={summaryEl}>
						<h2>Let’s connect by email.</h2>
						<p>
							The online form isn’t live yet. Please email
							<a href="mailto:{site.email}">{site.email}</a> — your details below can be copied straight
							in.
						</p>
					</div>
				{:else if Object.keys(errors).length > 0}
					<div class="alert alert--error" role="alert" tabindex="-1" bind:this={summaryEl}>
						<h2>Please fix the following:</h2>
						<ul>
							{#each Object.entries(errors) as [field, message] (field)}
								<li><a href="#{field}">{message}</a></li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			{#if status !== 'success'}
				<form
					novalidate
					onsubmit={handleSubmit}
					action="https://api.web3forms.com/submit"
					method="POST"
				>
					<!-- No-JS fallback fields (ignored by the enhanced JS path) -->
					{#if keyConfigured}
						<input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
					{/if}
					<input type="hidden" name="subject" value="New enquiry from the DID website" />
					<!-- Honeypot: real people leave this empty -->
					<label class="visually-hidden">
						Leave this field empty if you’re human
						<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" />
					</label>

					<Field
						id="name"
						label="Your name"
						bind:value={values.name}
						required
						autocomplete="name"
						error={errors.name}
					/>
					<Field
						id="email"
						label="Email address"
						type="email"
						bind:value={values.email}
						required
						autocomplete="email"
						error={errors.email}
					/>
					<Field
						id="organization"
						label="Organization"
						bind:value={values.organization}
						autocomplete="organization"
						description="Optional — who you’re reaching out on behalf of."
					/>
					<Field
						id="message"
						label="How can Eman help?"
						textarea
						bind:value={values.message}
						required
						error={errors.message}
						description="A sentence or two about your team, event, or campaign."
					/>

					<Button type="submit" size="lg">
						{status === 'submitting' ? 'Sending…' : 'Send message'}
					</Button>
				</form>
			{/if}
		</div>

		<aside class="contact__aside" aria-labelledby="other-ways">
			<h2 id="other-ways">Other ways to reach Eman</h2>
			<p class="contact__method">
				<Icon name="mail" size={22} />
				<a href="mailto:{site.email}">{site.email}</a>
			</p>
			<h3>Follow &amp; connect</h3>
			<ul class="contact__socials">
				{#each socials as s (s.href)}
					<li>
						<a href={s.href} target="_blank" rel="noopener noreferrer">
							{s.label}<span class="visually-hidden"> (opens in a new tab)</span>
						</a>
					</li>
				{/each}
			</ul>
			<p class="contact__note">
				Need this conversation in another format? Just ask — accessibility works both ways.
			</p>
		</aside>
	</div>
</div>

<style>
	.section {
		padding-block: var(--space-2xl) var(--space-3xl);
	}
	.contact {
		display: grid;
		gap: var(--space-2xl);
		align-items: start;
	}
	@media (min-width: 52rem) {
		.contact {
			grid-template-columns: 1.5fr 1fr;
		}
	}

	form {
		max-width: 40rem;
	}

	.status:empty {
		display: none;
	}
	.alert {
		padding: var(--space-lg);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-lg);
		border: 2px solid;
	}
	.alert h2 {
		font-size: var(--step-1);
		margin-bottom: var(--space-xs);
	}
	.alert ul {
		margin: 0;
		padding-left: var(--space-lg);
	}
	.alert--success {
		background: color-mix(in srgb, var(--color-success) 12%, var(--color-surface));
		border-color: var(--color-success);
	}
	.alert--error {
		background: var(--color-error-bg);
		border-color: var(--color-error);
	}
	.alert--info {
		background: var(--color-surface-alt);
		border-color: var(--color-primary);
	}

	.contact__aside {
		padding: var(--space-xl);
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	.contact__aside h2 {
		font-size: var(--step-1);
	}
	.contact__aside h3 {
		font-size: var(--step-0);
		margin-top: var(--space-lg);
	}
	.contact__method {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-top: var(--space-md);
		color: var(--color-primary);
	}
	.contact__socials {
		list-style: none;
		margin: var(--space-sm) 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
	.contact__socials a {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-min);
	}
	.contact__note {
		margin-top: var(--space-lg);
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
</style>
