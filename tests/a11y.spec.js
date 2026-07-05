import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated WCAG 2.2 AA audit across every prerendered route,
 * plus keyboard-interaction checks for the shell (skip link + disclosure nav).
 */
const routes = [
	{ path: '/', name: 'home' },
	{ path: '/about/', name: 'about' },
	{ path: '/services/', name: 'services' },
	{ path: '/speaking/', name: 'speaking' },
	{ path: '/contact/', name: 'contact' },
	{ path: '/accessibility/', name: 'accessibility' },
	{ path: '/speaker-kit/', name: 'speaker-kit' }
];

for (const route of routes) {
	test(`${route.name} has no automatically-detectable a11y violations`, async ({ page }) => {
		await page.goto(route.path);
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(results.violations).toEqual([]);
	});
}

test('skip link is the first focusable element and targets main', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	const focused = page.locator(':focus');
	await expect(focused).toHaveText(/skip to main content/i);
	await expect(focused).toHaveAttribute('href', '#main-content');
});

test('mobile nav toggle is keyboard operable and Escape closes it', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 800 });
	await page.goto('/');
	const toggle = page.getByRole('button', { name: /menu/i });
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');

	await toggle.focus();
	await page.keyboard.press('Enter');
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	await expect(primaryNav.getByRole('link', { name: 'Services' })).toBeVisible();

	// Escape closes the menu and returns focus to the toggle.
	await page.keyboard.press('Escape');
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(toggle).toBeFocused();
});

test('contact form announces validation errors and moves focus to the summary', async ({
	page
}) => {
	await page.goto('/contact/');
	await page.getByRole('button', { name: /send message/i }).click();
	const alert = page.getByRole('alert');
	await expect(alert).toBeVisible();
	await expect(alert).toContainText(/please fix the following/i);
	// The summary receives focus so screen-reader users hear it immediately.
	await expect(alert).toBeFocused();
	// Each error links to its field.
	await expect(alert.getByRole('link', { name: /enter your name/i })).toBeVisible();
});

test('accessibility preferences panel applies a theme and Escape closes it', async ({ page }) => {
	await page.goto('/');
	const trigger = page.getByRole('button', { name: /accessibility/i });
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await trigger.click();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');

	// Choosing Dark sets data-theme on <html> and persists.
	await page.getByRole('radio', { name: 'Dark' }).check();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

	// Escape closes the panel and returns focus to the trigger.
	await page.keyboard.press('Escape');
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect(trigger).toBeFocused();

	// Preference survives a reload.
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a 404 route renders the accessible error page', async ({ page }) => {
	const response = await page.goto('/this-route-does-not-exist/');
	expect(response).toBeTruthy();
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
