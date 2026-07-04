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
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'node_modules/', 'package/']
	}
];
