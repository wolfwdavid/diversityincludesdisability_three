/**
 * Accessibility preferences — the native, engineered-in alternative to a
 * third-party overlay widget. Choices layer over the user's system settings
 * (`prefers-color-scheme`, `prefers-reduced-motion`) and persist in
 * localStorage. Applied by setting data-* attributes on <html>, which the
 * token layer (tokens.css / base.css) reacts to.
 */

export const STORAGE_KEY = 'did-prefs';

/** @typedef {{ mode: string, theme: string, textSize: string, motion: string }} Prefs */

/** @type {Prefs} */
export const defaults = { mode: 'premium', theme: 'system', textSize: 'default', motion: 'system' };

export const options = {
	mode: [
		{ value: 'premium', label: 'Premium (visual, 3D)' },
		{ value: 'accessible', label: 'Accessibility (WCAG AA)' }
	],
	theme: [
		{ value: 'system', label: 'Match my system' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'high-contrast', label: 'High contrast' }
	],
	textSize: [
		{ value: 'default', label: 'Default' },
		{ value: 'large', label: 'Large' },
		{ value: 'x-large', label: 'Extra large' }
	],
	motion: [
		{ value: 'system', label: 'Match my system' },
		{ value: 'reduce', label: 'Reduce motion' }
	]
};

/**
 * Apply preferences to the document element via data-* attributes.
 * "system"/"default" values remove the attribute so the OS setting wins.
 * @param {Prefs} prefs
 */
export function applyPrefs(prefs) {
	const el = document.documentElement;

	// Display mode: premium (default) vs accessible (strict AA/AAA, no 3D).
	if (prefs.mode === 'accessible') el.setAttribute('data-mode', 'accessible');
	else el.removeAttribute('data-mode');

	// Theme (light/dark/high-contrast) only applies inside accessible mode.
	if (prefs.mode === 'accessible' && prefs.theme && prefs.theme !== 'system')
		el.setAttribute('data-theme', prefs.theme);
	else el.removeAttribute('data-theme');

	if (prefs.textSize && prefs.textSize !== 'default')
		el.setAttribute('data-text-size', prefs.textSize);
	else el.removeAttribute('data-text-size');

	// Accessible mode forces reduced motion; otherwise honour the choice.
	if (prefs.motion === 'reduce' || prefs.mode === 'accessible')
		el.setAttribute('data-motion', 'reduce');
	else el.removeAttribute('data-motion');
}

/**
 * True when the given prefs should render the premium 3D experience.
 * @param {Prefs} prefs
 */
export function isPremium(prefs) {
	return prefs.mode !== 'accessible';
}

/** @returns {Prefs} */
export function loadPrefs() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...defaults };
		return { ...defaults, ...JSON.parse(raw) };
	} catch {
		return { ...defaults };
	}
}

/** @param {Prefs} prefs */
export function savePrefs(prefs) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
	} catch {
		/* storage unavailable — preferences apply for this session only */
	}
}
