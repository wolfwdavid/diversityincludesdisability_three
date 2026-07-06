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

// Resolved semantic pairs. Accessible mode is verified to WCAG 2.2 AA (body
// AAA). Premium mode's text is also checked (it stays highly readable); its
// decorative glass/gradient are intentionally not text and not checked.
const pairs = [
	// ---- ACCESSIBLE · LIGHT ----
	['a11y light: text on bg', '#17121e', '#faf7f2', 4.5, true],
	['a11y light: text on surface', '#17121e', '#ffffff', 4.5, true],
	['a11y light: muted on bg', '#595162', '#faf7f2', 4.5, false],
	['a11y light: muted on surface-alt', '#595162', '#f3ece1', 4.5, false],
	['a11y light: link on bg', '#0b5a62', '#faf7f2', 4.5, false],
	['a11y light: link on surface', '#0b5a62', '#ffffff', 4.5, false],
	['a11y light: accent on bg', '#855700', '#faf7f2', 4.5, false],
	['a11y light: accent on surface', '#855700', '#ffffff', 4.5, false],
	['a11y light: on-primary on primary', '#ffffff', '#0b5a62', 4.5, false],
	['a11y light: text-invert on surface-invert', '#faf7f2', '#06333a', 4.5, true],
	['a11y light: error on error-bg', '#a11a2b', '#fdecee', 4.5, false],
	['a11y light: success on bg', '#1f6b3a', '#faf7f2', 4.5, false],
	['a11y light: focus ring vs bg', '#0b5a62', '#faf7f2', 3.0, false],
	// Impact stat (.impact__value) rides --color-surface-invert, which flips per
	// mode/theme. Each variant is checked against ITS OWN band so a mode-flipping
	// regression (like the premium 1.97:1 gold-on-light bug) cannot pass again.
	['a11y light: impact-value on surface-invert', '#e0a83a', '#06333a', 4.5, false],
	['a11y light: cream text on surface-invert', '#faf7f2', '#06333a', 4.5, false],
	// ---- ACCESSIBLE · DARK ----
	['a11y dark: text on bg', '#eef7f8', '#032024', 4.5, true],
	['a11y dark: text on surface', '#eef7f8', '#06333a', 4.5, true],
	['a11y dark: muted on bg', '#bcd6d9', '#032024', 4.5, false],
	['a11y dark: link on bg', '#8fd6dd', '#032024', 4.5, false],
	['a11y dark: accent on bg', '#e0a83a', '#032024', 4.5, false],
	['a11y dark: on-primary on primary', '#032024', '#8fd6dd', 4.5, false],
	['a11y dark: error on bg', '#ff9aa6', '#032024', 4.5, false],
	['a11y dark: success on bg', '#7ddba0', '#032024', 4.5, false],
	['a11y dark: focus ring vs bg', '#e0a83a', '#032024', 3.0, false],
	// surface-invert flips to LIGHT cream in accessible dark → deep gold stat.
	['a11y dark: impact-value on surface-invert', '#855700', '#f3ece1', 4.5, false],
	// ---- ACCESSIBLE · HIGH CONTRAST ----
	['a11y hc: text on bg', '#ffffff', '#000000', 4.5, true],
	['a11y hc: primary on bg', '#ffe14d', '#000000', 4.5, false],
	['a11y hc: on-primary on primary', '#000000', '#ffe14d', 4.5, false],
	['a11y hc: impact-value on surface-invert', '#855700', '#ffffff', 4.5, false],
	// ---- PREMIUM (text readability) ----
	['premium: text on bg', '#f5f5ff', '#07070e', 4.5, true],
	['premium: muted on bg', '#c3c3dc', '#07070e', 4.5, false],
	['premium: text on surface', '#f5f5ff', '#0d0d18', 4.5, true],
	['premium: link (cyan) on bg', '#67e8f9', '#07070e', 4.5, false],
	['premium: on-primary on primary', '#07070e', '#a78bfa', 4.5, false],
	['premium: accent (cyan) on surface', '#67e8f9', '#0d0d18', 4.5, false],
	['premium: focus (cyan) vs bg', '#67e8f9', '#07070e', 3.0, false],
	// surface-invert is the LIGHT fog band in premium → deep gold stat. This is the
	// pair the old gate missed (it only tested gold against the accessible teal band).
	['premium: impact-value on surface-invert', '#855700', '#f5f5ff', 4.5, false]
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
