import { defineConfig, devices } from '@playwright/test';

const PORT = 5290;

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	// Serve the prebuilt static site for the a11y audit.
	// Run `pnpm run build` before `pnpm run test:a11y` (CI does both).
	webServer: {
		command: `pnpm exec vite preview --port ${PORT} --strictPort`,
		port: PORT,
		reuseExistingServer: true,
		timeout: 60_000
	}
});
