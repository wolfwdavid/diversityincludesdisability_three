<script>
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import StatTile from '$lib/components/content/StatTile.svelte';
	import CtaBand from '$lib/components/content/CtaBand.svelte';
	import PortraitPlaceholder from '$lib/components/content/PortraitPlaceholder.svelte';
	import { services } from '$lib/content/services.js';
	import { stats } from '$lib/content/about.js';
</script>

<svelte:head>
	<title>Diversity Includes Disability — Eman Rimawi-Doster</title>
	<meta
		name="description"
		content="Intersectional disability equity training, consulting, speaking, and modeling with Eman Rimawi-Doster — a disability rights organizer, speaker, and model."
	/>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="container hero__grid">
		<div class="hero__text">
			<p class="hero__eyebrow">Diversity Includes Disability</p>
			<h1>Intersectional disability equity, from lived experience.</h1>
			<p class="hero__lead">
				Eman Rimawi-Doster helps organizations move past compliance to real access — through
				training, consulting, speaking, and authentic representation.
			</p>
			<div class="hero__actions">
				<Button href="{base}/contact/" variant="primary" size="lg">Work with Eman</Button>
				<Button href="{base}/services/" variant="secondary" size="lg">Explore services</Button>
			</div>
		</div>
		<div class="hero__media">
			<PortraitPlaceholder label="Portrait of Eman Rimawi-Doster" />
		</div>
	</div>
</section>

<!-- Services overview -->
<section class="section section--alt" aria-labelledby="services-heading">
	<div class="container">
		<div class="section__head">
			<h2 id="services-heading">How Eman works with you</h2>
			<p class="section__intro">
				Four ways to bring intersectional disability equity into your work.
			</p>
		</div>
		<ul class="service-grid">
			{#each services as service (service.slug)}
				<li>
					<a class="service-card" href="{base}/services/#{service.slug}">
						<span class="service-card__icon"><Icon name={service.icon} size={30} /></span>
						<h3 class="service-card__title">{service.title}</h3>
						<p class="service-card__summary">{service.summary}</p>
						<span class="service-card__more">
							Learn more <Icon name="arrow-right" size={18} />
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Credibility -->
<section class="section" aria-labelledby="credibility-heading">
	<div class="container">
		<div class="section__head">
			<h2 id="credibility-heading">Experience that organizations trust</h2>
			<p class="section__intro">
				Eman brings years of frontline disability organizing to every engagement.
			</p>
		</div>
		<ul class="stat-grid">
			{#each stats as stat (stat.label)}
				<li><StatTile value={stat.value} label={stat.label} icon={stat.icon} /></li>
			{/each}
		</ul>
	</div>
</section>

<!-- About teaser -->
<section class="section section--alt" aria-labelledby="about-teaser-heading">
	<div class="container about-teaser">
		<div>
			<h2 id="about-teaser-heading">Disability is not the problem. Barriers are.</h2>
			<p>
				Eman is Black, Palestinian, a woman, and a bilateral amputee — and she thinks about
				diversity in a multifaceted way, because she lives it. Her work is grounded in the social
				model of disability and years of organizing for accessible transit, voting rights, and
				health equity.
			</p>
			<p>
				<Button href="{base}/about/" variant="ghost"
					>Read Eman’s story <Icon name="arrow-right" size={18} /></Button
				>
			</p>
		</div>
	</div>
</section>

<CtaBand />

<style>
	.hero {
		padding-block: var(--space-2xl) var(--space-3xl);
	}
	.hero__grid {
		display: grid;
		gap: var(--space-2xl);
		align-items: center;
	}
	@media (min-width: 52rem) {
		.hero__grid {
			grid-template-columns: 1.3fr 1fr;
		}
	}
	.hero__eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: var(--color-accent);
		margin-bottom: var(--space-sm);
	}
	.hero__lead {
		margin-top: var(--space-lg);
		font-size: var(--step-1);
		color: var(--color-text-muted);
	}
	.hero__actions {
		margin-top: var(--space-xl);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
	.hero__media {
		max-width: 26rem;
		width: 100%;
		justify-self: center;
	}

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
		font-size: var(--step-1);
		color: var(--color-text-muted);
	}

	.service-grid,
	.stat-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-lg);
		grid-template-columns: 1fr;
	}
	@media (min-width: 40rem) {
		.service-grid,
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 60rem) {
		.stat-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.service-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		height: 100%;
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
		color: var(--color-text);
		transition:
			border-color var(--motion-fast) var(--ease),
			box-shadow var(--motion-fast) var(--ease),
			transform var(--motion-fast) var(--ease);
	}
	.service-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}
	.service-card__icon {
		color: var(--color-primary);
	}
	.service-card__title {
		font-size: var(--step-1);
		margin: 0;
	}
	.service-card__summary {
		color: var(--color-text-muted);
		margin: 0;
	}
	.service-card__more {
		margin-top: auto;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-weight: 700;
		color: var(--color-link);
	}

	.about-teaser {
		max-width: var(--width-prose);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
</style>
