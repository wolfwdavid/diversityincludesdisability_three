<script>
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';
	import { afterNavigate } from '$app/navigation';
	import SkipLink from '$lib/components/a11y/SkipLink.svelte';
	import SiteHeader from '$lib/components/nav/SiteHeader.svelte';
	import SiteFooter from '$lib/components/nav/SiteFooter.svelte';

	let { children } = $props();

	/** @type {HTMLElement | undefined} */
	let mainEl = $state();

	// On a real client-side navigation, move focus to the main region so
	// keyboard and screen-reader users land at the new content (not stranded in
	// the header). Skip the initial page load ('enter') to avoid stealing focus.
	afterNavigate((nav) => {
		if (nav.type !== 'enter' && mainEl) {
			mainEl.focus();
		}
	});
</script>

<SkipLink />
<SiteHeader />

<main id="main-content" tabindex="-1" bind:this={mainEl}>
	{@render children()}
</main>

<SiteFooter />

<style>
	main {
		display: block;
	}
	/* Never show a focus ring on the programmatic main-content focus target */
	main:focus {
		outline: none;
	}
</style>
