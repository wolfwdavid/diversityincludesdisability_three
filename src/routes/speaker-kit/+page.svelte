<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { site } from '$lib/content/site.js';
	import { services } from '$lib/content/services.js';
	import { topics, stats } from '$lib/content/about.js';

	function print() {
		if (typeof window !== 'undefined') window.print();
	}
</script>

<svelte:head>
	<title>Speaker one-sheet — Eman Rimawi-Doster</title>
	<meta
		name="description"
		content="A printable speaker one-sheet and media kit for Eman Rimawi-Doster — disability equity trainer, consultant, speaker, and model."
	/>
</svelte:head>

<div class="section">
	<div class="container">
		<div class="onesheet__bar no-print">
			<p>This is Eman’s speaker one-sheet. Print it or save it as a PDF for your files.</p>
			<Button type="button" onclick={print}>Print / save as PDF</Button>
		</div>

		<article class="onesheet" aria-label="Speaker one-sheet">
			<header class="onesheet__head">
				<p class="onesheet__eyebrow">Speaker one-sheet</p>
				<h1>Eman Rimawi-Doster</h1>
				<p class="onesheet__role">
					Disability equity trainer, consultant, speaker &amp; model — {site.name}
				</p>
				<p class="onesheet__tag">{site.tagline}</p>
			</header>

			<section aria-labelledby="os-about">
				<h2 id="os-about">About</h2>
				<p>
					Eman Rimawi-Doster is a New York disability rights organizer, trainer, speaker, and model
					— Black, Palestinian, a woman, and a bilateral amputee. She has advocated for accessible
					transit, voting rights, and health equity, served as an Access-A-Ride Coordinator and
					Organizer, and led as Executive Director of the Harlem Independent Living Center.
				</p>
			</section>

			<div class="onesheet__cols">
				<section aria-labelledby="os-services">
					<h2 id="os-services">Ways to work together</h2>
					<ul class="onesheet__list">
						{#each services as s (s.slug)}
							<li><strong>{s.title}.</strong> {s.summary}</li>
						{/each}
					</ul>
				</section>

				<section aria-labelledby="os-topics">
					<h2 id="os-topics">Speaking topics</h2>
					<ul class="onesheet__list">
						{#each topics as topic (topic)}
							<li>{topic}</li>
						{/each}
					</ul>
				</section>
			</div>

			<section aria-labelledby="os-experience">
				<h2 id="os-experience">Experience</h2>
				<ul class="onesheet__inline">
					{#each stats as stat (stat.label)}
						<li><strong>{stat.value}</strong> — {stat.label}</li>
					{/each}
				</ul>
			</section>

			<footer class="onesheet__contact">
				<h2><span class="onesheet__mail"><Icon name="mail" size={20} /></span> Book Eman</h2>
				<p>
					Email <a href="mailto:{site.email}">{site.email}</a> · Website
					<span>diversityincludesdisability.org</span>
				</p>
			</footer>
		</article>
	</div>
</div>

<style>
	.section {
		padding-block: var(--space-2xl) var(--space-3xl);
	}
	.onesheet__bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-xl);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.onesheet {
		max-width: 52rem;
		margin-inline: auto;
		padding: var(--space-2xl);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	.onesheet section {
		margin-top: var(--space-xl);
	}
	.onesheet h2 {
		font-size: var(--step-1);
		padding-bottom: var(--space-2xs);
		border-bottom: 3px solid var(--color-accent);
		margin-bottom: var(--space-sm);
	}

	.onesheet__head h1 {
		font-size: var(--step-4);
		margin-top: var(--space-2xs);
	}
	.onesheet__eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: var(--color-accent);
	}
	.onesheet__role {
		font-size: var(--step-1);
		font-weight: 700;
		margin-top: var(--space-xs);
	}
	.onesheet__tag {
		color: var(--color-text-muted);
		margin-top: var(--space-2xs);
	}

	.onesheet__cols {
		display: grid;
		gap: var(--space-xl);
	}
	@media (min-width: 40rem) {
		.onesheet__cols {
			grid-template-columns: 1fr 1fr;
		}
	}

	.onesheet__list {
		padding-left: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.onesheet__inline {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
	.onesheet__inline strong {
		color: var(--color-primary);
	}

	.onesheet__contact {
		margin-top: var(--space-xl);
		padding-top: var(--space-md);
	}
	.onesheet__mail {
		color: var(--color-accent);
		vertical-align: middle;
	}

	@media print {
		.onesheet {
			border: 0;
			padding: 0;
			max-width: none;
		}
		.section {
			padding: 0;
		}
	}
</style>
