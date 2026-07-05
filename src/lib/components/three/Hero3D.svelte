<script>
	import { onMount } from 'svelte';

	// Decorative 3D hero. Mounts the Threlte scene ONLY when:
	//  - running in the browser with WebGL, AND
	//  - premium mode is active (data-mode !== 'accessible'), AND
	//  - the user hasn't asked to reduce motion.
	// Otherwise a static iridescent fallback renders. The whole thing is
	// aria-hidden — it carries no information a screen-reader or keyboard needs.

	/** @type {import('svelte').Component | null} */
	let SceneComp = $state(null);
	let show3d = $state(false);
	let failed = $state(false);

	function webglOK() {
		try {
			const c = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && c.getContext('webgl2'));
		} catch {
			return false;
		}
	}

	function shouldRender() {
		const el = document.documentElement;
		const accessible = el.getAttribute('data-mode') === 'accessible';
		const reduce =
			el.getAttribute('data-motion') === 'reduce' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		return !accessible && !reduce && !failed;
	}

	async function sync() {
		const want = shouldRender();
		if (want && webglOK()) {
			if (!SceneComp) {
				try {
					const mod = await import('./HeroScene.svelte');
					SceneComp = mod.default;
				} catch {
					failed = true;
				}
			}
			show3d = !!SceneComp;
		} else {
			show3d = false;
		}
	}

	onMount(() => {
		sync();
		const obs = new MutationObserver(sync);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-mode', 'data-motion']
		});
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		mq.addEventListener('change', sync);
		return () => {
			obs.disconnect();
			mq.removeEventListener('change', sync);
		};
	});
</script>

<div class="hero3d" aria-hidden="true">
	{#if show3d && SceneComp}
		<div class="hero3d__canvas"><SceneComp /></div>
	{:else}
		<div class="hero3d__fallback"></div>
	{/if}
</div>

<style>
	.hero3d {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		max-width: 34rem;
		margin-inline: auto;
	}
	.hero3d__canvas,
	.hero3d__fallback {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	/* Static iridescent fallback — layered conic + radial gradients, gently
	   animated only when motion is allowed. */
	.hero3d__fallback {
		background:
			radial-gradient(60% 60% at 30% 30%, rgba(103, 232, 249, 0.85), transparent 60%),
			radial-gradient(55% 55% at 70% 40%, rgba(240, 171, 252, 0.8), transparent 60%),
			conic-gradient(from 120deg at 50% 55%, #818cf8, #67e8f9, #f0abfc, #a78bfa, #818cf8);
		filter: saturate(1.05);
		mask-image: radial-gradient(closest-side, #000 68%, transparent 100%);
		-webkit-mask-image: radial-gradient(closest-side, #000 68%, transparent 100%);
	}
	:root:not([data-mode='accessible']) .hero3d__fallback {
		animation: iris-spin 24s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.hero3d__fallback {
			animation: none !important;
		}
	}
	@keyframes iris-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
