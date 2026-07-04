import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

/** Flat config. Accessibility rules ship with eslint-plugin-svelte's recommended set. */
export default [
	js.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// We use `base` from $app/paths for internal links (data-driven nav,
			// component href props, mailto/hash). The build's handleHttpError:'fail'
			// plus svelte-check already guard against broken internal links.
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'node_modules/', 'package/']
	}
];
