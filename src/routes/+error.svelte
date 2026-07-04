<script>
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status} — Page not found — Diversity Includes Disability</title>
</svelte:head>

<section class="container error">
	<p class="error__code">{page.status}</p>
	<h1>We couldn't find that page.</h1>
	<p>
		The page you were looking for may have moved. Head back to the
		<a href="{base}/">home page</a> to find your way.
	</p>
</section>

<style>
	.error {
		padding-block: var(--space-3xl);
	}
	.error__code {
		font-family: var(--font-heading);
		font-size: var(--step-5);
		font-weight: 700;
		color: var(--color-accent);
	}
</style>
