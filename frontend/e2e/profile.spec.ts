import { expect, test } from './fixtures/auth.fixture'

test.describe('Profile', () => {
	test.beforeEach(async ({ page }) => {
		// Mock user profile API
		await page.route('**/api/v1/users/*', (route) => {
			const url = route.request().url()
			if (url.includes('/ideas')) {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] }),
				})
			} else if (url.includes('/followers') || url.includes('/following')) {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ success: true, data: [] }),
				})
			} else {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: {
							id: 'user:test123',
							name: 'Test User',
							email: 'test@example.com',
							bio: 'A passionate entrepreneur',
							avatar: null,
							verified: true,
							ycVerified: false,
							createdAt: new Date().toISOString(),
						},
					}),
				})
			}
		})
	})

	test('should display user profile page', async ({ authenticatedPage: page }) => {
		await page.goto('/profile/test123')
		// Should show profile content or loading state
		await expect(page.locator('main, section, article').first()).toBeVisible()
	})

	test('should show user stats section', async ({ authenticatedPage: page }) => {
		await page.goto('/profile/test123')
		// Should have stats like followers, following, ideas
		await expect(page.locator('text=/ideas|followers|following/i').first()).toBeVisible()
	})

	test('should have settings link on own profile', async ({ authenticatedPage: page }) => {
		// Navigate to own profile (user:test123 matches the mock auth user)
		await page.goto('/profile/test123')
		// Own profile should have edit/settings option
		const settingsLink = page.getByRole('link', { name: /settings|edit/i })
		await expect(settingsLink.first()).toBeVisible()
	})
})

test.describe('Settings', () => {
	test('should display settings page', async ({ authenticatedPage: page }) => {
		await page.goto('/settings')
		// Should show page content
		await expect(page.locator('main, section, article').first()).toBeVisible()
	})

	test('should have form elements', async ({ authenticatedPage: page }) => {
		await page.goto('/settings')
		// Should have form inputs
		await expect(page.locator('input, textarea, form').first()).toBeVisible()
	})

	test('should have action buttons', async ({ authenticatedPage: page }) => {
		await page.goto('/settings')
		await expect(page.getByRole('button').first()).toBeVisible()
	})
})
