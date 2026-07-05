<script>
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import CtaBand from '$lib/components/content/CtaBand.svelte';
	import PortraitPlaceholder from '$lib/components/content/PortraitPlaceholder.svelte';
	import { bio, values, impact } from '$lib/content/about.js';
</script>

<svelte:head>
	<title>About Eman Rimawi-Doster — Diversity Includes Disability</title>
	<meta
		name="description"
		content="Eman Rimawi-Doster is a disability rights organizer, trainer, speaker, and model — Black, Palestinian, a woman, and a bilateral amputee."
	/>
</svelte:head>

<PageHeader
	eyebrow="About"
	title="About Eman Rimawi-Doster"
	intro="Disability rights organizer, trainer, speaker, model — and an artist who thinks about diversity in a multifaceted way, because she lives it."
/>

<section class="section">
	<div class="container bio">
		<div class="bio__body">
			{#each bio as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
		<aside class="bio__media">
			<PortraitPlaceholder label="Portrait of Eman Rimawi-Doster" />
		</aside>
	</div>
</section>

<section class="section section--alt" aria-labelledby="values-heading">
	<div class="container">
		<div class="section__head">
			<h2 id="values-heading">How Eman approaches the work</h2>
		</div>
		<ul class="values">
			{#each values as value (value.title)}
				<li class="value">
					<h3 class="value__title">{value.title}</h3>
					<p class="value__body">{value.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section" aria-labelledby="impact-heading">
	<div class="container">
		<h2 id="impact-heading" class="visually-hidden">Why this work matters</h2>
		<div class="impact">
			<p class="impact__value">{impact.value}</p>
			<div class="impact__body">
				<p class="impact__label">{impact.label}.</p>
				<p class="impact__note">{impact.note}</p>
				<p class="impact__source">Source: {impact.source}</p>
			</div>
		</div>
	</div>
</section>

<CtaBand heading="Bring Eman’s perspective to your work." />

<style>
	.section {
		padding-block: var(--space-3xl);
	}
	.section--alt {
		background: var(--color-surface-alt);
	}
	.section__head {
		max-width: var(--width-prose);
		margin-bottom: var(--space-xl);
	}

	.bio {
		display: grid;
		gap: var(--space-2xl);
		align-items: start;
	}
	@media (min-width: 52rem) {
		.bio {
			grid-template-columns: 1.4fr 1fr;
		}
		.bio__media {
			position: sticky;
			top: 6rem;
		}
	}
	.bio__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		font-size: var(--step-1);
	}
	.bio__media {
		max-width: 24rem;
		width: 100%;
		justify-self: center;
	}

	.values {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-lg);
		grid-template-columns: 1fr;
	}
	@media (min-width: 48rem) {
		.values {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.value {
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		border-top: 4px solid var(--color-accent);
	}
	.value__title {
		font-size: var(--step-1);
		margin-bottom: var(--space-xs);
	}
	.value__body {
		color: var(--color-text-muted);
		margin: 0;
	}

	.impact {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xl);
		margin: 0;
		padding: var(--space-xl);
		background: var(--color-surface-invert);
		color: var(--color-text-invert);
		border-radius: var(--radius-lg);
	}
	.impact__value {
		font-family: var(--font-heading);
		font-size: var(--step-5);
		font-weight: 700;
		/* Always-dark band → use the light gold primitive for AA contrast */
		color: var(--gold-300);
		line-height: 1;
		margin: 0;
	}
	.impact__body {
		flex: 1 1 20rem;
	}
	.impact__label {
		font-size: var(--step-2);
		font-weight: 700;
		margin: 0 0 var(--space-xs);
	}
	.impact__note {
		color: var(--color-text-invert);
		opacity: 0.92;
		margin: 0 0 var(--space-sm);
	}
	.impact__source {
		font-size: var(--step--1);
		opacity: 0.85;
	}
</style>
