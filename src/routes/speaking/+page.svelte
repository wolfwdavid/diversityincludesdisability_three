<script>
	import { base } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import CtaBand from '$lib/components/content/CtaBand.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { engagements, topics } from '$lib/content/about.js';
</script>

<svelte:head>
	<title>Speaking & Portfolio — Diversity Includes Disability</title>
	<meta
		name="description"
		content="Speaking engagements, panels, training, and advocacy by Eman Rimawi-Doster — from public-official training to transit testimony and podcasts."
	/>
</svelte:head>

<PageHeader
	eyebrow="Speaking & Portfolio"
	title="Speaking, panels & representation"
	intro="Eman has trained public officials, testified on transit and access, and spoken on stages and podcasts about disability at the intersection of race, gender, and disability."
>
	<Button href="{base}/speaker-kit/" variant="secondary">View speaker one-sheet</Button>
</PageHeader>

<section class="section" aria-labelledby="topics-heading">
	<div class="container">
		<div class="section__head">
			<h2 id="topics-heading">Topics Eman speaks on</h2>
		</div>
		<ul class="topics">
			{#each topics as topic (topic)}
				<li class="topic"><Icon name="mic" size={20} /> <span>{topic}</span></li>
			{/each}
		</ul>
	</div>
</section>

<section class="section section--alt" aria-labelledby="engagements-heading">
	<div class="container">
		<div class="section__head">
			<h2 id="engagements-heading">Selected engagements</h2>
			<p class="section__intro">
				A sample of Eman’s public work. Links and dates added as confirmed.
			</p>
		</div>
		<ul class="engagements">
			{#each engagements as item (item.title)}
				<li class="engagement">
					<span class="engagement__kind">{item.kind}</span>
					<p class="engagement__title">{item.title}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<CtaBand
	heading="Invite Eman to your stage."
	text="Keynotes, panels, and moderated conversations on disability justice."
/>

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
	.section__intro {
		margin-top: var(--space-sm);
		color: var(--color-text-muted);
	}

	.topics {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-md);
		grid-template-columns: 1fr;
	}
	@media (min-width: 40rem) {
		.topics {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.topic {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
		padding: var(--space-md) var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-primary);
	}
	.topic span {
		color: var(--color-text);
		font-weight: 600;
	}

	.engagements {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	.engagement {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-left: 4px solid var(--color-primary);
		border-radius: var(--radius-md);
	}
	.engagement__kind {
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: var(--step--1);
		font-weight: 700;
		color: var(--color-accent);
	}
	.engagement__title {
		margin: 0;
		font-size: var(--step-1);
	}
</style>
