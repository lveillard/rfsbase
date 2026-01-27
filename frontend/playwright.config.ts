import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: CI,
	retries: CI ? 2 : 0,
	workers: CI ? 1 : undefined,
	reporter: CI
		? [['github'], ['html', { open: 'never' }]]
		: [['html', { open: 'never' }], ['list']],
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
		// Consistent viewport for screenshots
		viewport: { width: 1280, height: 720 },
	},
	// Only run desktop browsers by default; mobile in CI
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
		...(CI
			? [
					{
						name: 'mobile-chrome',
						use: { ...devices['Pixel 5'] },
					},
					{
						name: 'mobile-safari',
						use: { ...devices['iPhone 12'] },
					},
				]
			: []),
	],
	webServer: {
		command: 'pnpm run dev',
		url: BASE_URL,
		reuseExistingServer: !CI,
		timeout: 120000,
	},
	// Output directory for test artifacts
	outputDir: 'e2e-results',
	// Global timeout per test
	timeout: 30000,
	expect: {
		timeout: 5000,
	},
})
