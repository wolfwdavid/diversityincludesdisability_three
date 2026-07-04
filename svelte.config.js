import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * GitHub Pages serves this project from a subpath
 * (https://<user>.github.io/diversityincludesdisability_three/).
 * The CI workflow sets BASE_PATH so every internal link/asset resolves.
 * Locally BASE_PATH is empty, so dev/preview run at the root.
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// SPA-style fallback so unknown routes still resolve on Pages.
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.BASE_PATH ?? ''
		},
		// Fail the build if a prerendered link points somewhere that 404s.
		prerender: {
			handleHttpError: 'fail',
			handleMissingId: 'fail'
		}
	}
};

export default config;
