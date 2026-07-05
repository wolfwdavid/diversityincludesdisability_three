<script>
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import CtaBand from '$lib/components/content/CtaBand.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { services } from '$lib/content/services.js';
</script>

<svelte:head>
	<title>Services — Diversity Includes Disability</title>
	<meta
		name="description"
		content="Intersectional disability equity training and facilitation, consulting, modeling for representation, and speaking with Eman Rimawi-Doster."
	/>
</svelte:head>

<PageHeader
	eyebrow="Services"
	title="Work with Eman"
	intro="Four ways to move your organization past compliance to real, intersectional access."
/>

<nav class="container jump" aria-label="Services">
	<ul>
		{#each services as service (service.slug)}
			<li><a href="#{service.slug}">{service.title}</a></li>
		{/each}
	</ul>
</nav>

<div class="services">
	{#each services as service, i (service.slug)}
		<section
			id={service.slug}
			class="service"
			class:service--alt={i % 2 === 1}
			aria-labelledby="{service.slug}-heading"
		>
			<div class="container service__grid">
				<div class="service__intro">
					<span class="service__icon"><Icon name={service.icon} size={36} /></span>
					<h2 id="{service.slug}-heading">{service.title}</h2>
					<p class="service__forwho">{service.forWho}</p>
				</div>
				<div class="service__body">
					{#each service.body as paragraph, p (p)}
						<p>{paragraph}</p>
					{/each}
					<h3 class="service__outcomes-title">What you get</h3>
					<ul class="service__outcomes">
						{#each service.outcomes as outcome (outcome)}
							<li>
								<span class="service__check"><Icon name="check" size={20} /></span>
								<span>{outcome}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	{/each}
</div>

<CtaBand />

<style>
	.jump {
		padding-block: var(--space-lg);
	}
	.jump ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}
	.jump a {
		display: inline-flex;
		align-items: center;
		min-height: var(--target-min);
		padding-inline: var(--space-md);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-full);
		text-decoration: none;
		font-weight: 600;
		color: var(--color-text);
	}
	.jump a:hover {
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-color: var(--color-primary);
	}

	.service {
		padding-block: var(--space-2xl);
		scroll-margin-top: 5rem;
	}
	.service--alt {
		background: var(--color-surface-alt);
	}
	.service__grid {
		display: grid;
		gap: var(--space-xl);
		align-items: start;
	}
	@media (min-width: 52rem) {
		.service__grid {
			grid-template-columns: 1fr 1.6fr;
		}
		.service__intro {
			position: sticky;
			top: 5.5rem;
		}
	}
	.service__icon {
		display: inline-flex;
		padding: var(--space-sm);
		color: var(--color-primary);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-sm);
	}
	.service__forwho {
		margin-top: var(--space-sm);
		color: var(--color-text-muted);
		font-weight: 600;
	}
	.service__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		font-size: var(--step-1);
		max-width: var(--width-prose);
	}
	.service__outcomes-title {
		font-size: var(--step-1);
		margin-top: var(--space-sm);
	}
	.service__outcomes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.service__outcomes li {
		display: flex;
		gap: var(--space-sm);
		align-items: flex-start;
	}
	.service__check {
		color: var(--color-success);
		flex-shrink: 0;
		margin-top: 0.15em;
	}
</style>
