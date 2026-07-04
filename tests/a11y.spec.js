import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated WCAG 2.2 AA audit across every prerendered route.
 * Add new routes here as pages ship (Phases 3–5).
 */
const routes = [{ path: '/', name: 'home' }];

for (const route of routes) {
	test(`${route.name} has no automatically-detectable a11y violations`, async ({ page }) => {
		await page.goto(route.path);
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(results.violations).toEqual([]);
	});
}

test('a 404 route renders the accessible error page', async ({ page }) => {
	const response = await page.goto('/this-route-does-not-exist/');
	// Static host returns the SPA fallback; the accessible error UI still renders.
	expect(response).toBeTruthy();
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
