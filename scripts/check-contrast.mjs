/*
 * WCAG 2.2 contrast gate. Resolves the semantic token pairings for each theme
 * to concrete hex values and asserts every text/background pair clears its
 * required ratio (4.5:1 normal text, 3:1 large text / UI). Body pairs aim for
 * 7:1 (AAA) and are flagged (not failed) if they fall between 4.5 and 7.
 *
 * Run: node scripts/check-contrast.mjs  (also runs in CI before the build)
 */

/** @param {string} hex @returns {[number, number, number]} */
function toRgb(hex) {
	const h = hex.replace('#', '');
	return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Relative luminance per WCAG. */
function luminance(hex) {
	const [r, g, b] = toRgb(hex).map((v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
	const l1 = luminance(fg);
	const l2 = luminance(bg);
	const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
	return (hi + 0.05) / (lo + 0.05);
}

// Resolved semantic pairs per theme: [label, foreground, background, minRatio, isBody]
const pairs = [
	// ---- LIGHT ----
	['light: text on bg', '#17121e', '#faf7f2', 4.5, true],
	['light: text on surface', '#17121e', '#ffffff', 4.5, true],
	['light: muted on bg', '#595162', '#faf7f2', 4.5, false],
	['light: muted on surface-alt', '#595162', '#f3ece1', 4.5, false],
	['light: link on bg', '#46295f', '#faf7f2', 4.5, false],
	['light: link on surface', '#46295f', '#ffffff', 4.5, false],
	['light: accent on bg', '#855700', '#faf7f2', 4.5, false],
	['light: accent on surface', '#855700', '#ffffff', 4.5, false],
	['light: on-primary on primary', '#ffffff', '#46295f', 4.5, false],
	['light: text-invert on surface-invert', '#faf7f2', '#21132f', 4.5, true],
	['light: error on error-bg', '#a11a2b', '#fdecee', 4.5, false],
	['light: success on bg', '#1f6b3a', '#faf7f2', 4.5, false],
	['light: focus ring vs bg', '#46295f', '#faf7f2', 3.0, false],
	['light: gold-300 stat on surface-invert', '#e0a83a', '#21132f', 4.5, false],
	['light: cream text on surface-invert', '#faf7f2', '#21132f', 4.5, false],
	// ---- DARK ----
	['dark: text on bg', '#f4eef8', '#180d24', 4.5, true],
	['dark: text on surface', '#f4eef8', '#21132f', 4.5, true],
	['dark: muted on bg', '#cbbfd9', '#180d24', 4.5, false],
	['dark: link on bg', '#d9c2f0', '#180d24', 4.5, false],
	['dark: accent on bg', '#e0a83a', '#180d24', 4.5, false],
	['dark: on-primary on primary', '#180d24', '#d9c2f0', 4.5, false],
	['dark: error on bg', '#ff9aa6', '#180d24', 4.5, false],
	['dark: success on bg', '#7ddba0', '#180d24', 4.5, false],
	['dark: focus ring vs bg', '#e0a83a', '#180d24', 3.0, false],
	// ---- HIGH CONTRAST ----
	['hc: text on bg', '#ffffff', '#000000', 4.5, true],
	['hc: primary on bg', '#ffe14d', '#000000', 4.5, false],
	['hc: on-primary on primary', '#000000', '#ffe14d', 4.5, false]
];

let failed = 0;
let flagged = 0;
console.log('WCAG 2.2 contrast check\n' + '-'.repeat(60));
for (const [label, fg, bg, min, isBody] of pairs) {
	const r = ratio(fg, bg);
	const pass = r >= min;
	const status = pass ? 'PASS' : 'FAIL';
	let note = '';
	if (!pass) failed++;
	else if (isBody && r < 7) {
		note = '  (AA ok; below 7:1 AAA aspiration)';
		flagged++;
	}
	console.log(`${status}  ${r.toFixed(2)}:1  (min ${min})  ${label}${note}`);
}
console.log('-'.repeat(60));
console.log(`${pairs.length} pairs checked · ${failed} failed · ${flagged} below AAA aspiration`);

if (failed > 0) {
	console.error(`\n✗ ${failed} contrast pair(s) below WCAG 2.2 AA. Fix tokens.css.`);
	process.exit(1);
}
console.log('\n✓ All pairs meet WCAG 2.2 AA.');
