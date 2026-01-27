import { test as base, expect, type Page } from '@playwright/test'

// Extend the base test with auth utilities
export const test = base.extend<{ authenticatedPage: Page }>({
	authenticatedPage: async ({ page }, use) => {
		// Set up mock authentication
		await page.addInitScript(() => {
			// Mock the auth store
			const mockToken = 'mock-jwt-token'
			const mockUser = {
				id: 'user:test123',
				email: 'test@example.com',
				name: 'Test User',
				avatar: null,
				bio: 'A test user for E2E testing',
				verified: {
					email: true,
					yc: null,
				},
				stats: {
					ideasCount: 5,
					votesReceived: 42,
					commentsCount: 12,
					followersCount: 10,
					followingCount: 8,
				},
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			localStorage.setItem(
				'rfsbase-auth',
				JSON.stringify({
					state: { token: mockToken, user: mockUser },
					version: 0,
				}),
			)
		})

		await use(page)
	},
})

// Helper to log in via the UI (for full flow testing)
export async function loginViaUI(page: Page, email = 'test@example.com') {
	await page.goto('/login')

	// Fill in email
	await page.getByLabel('Email').fill(email)
	await page.getByRole('button', { name: 'Continue with Email' }).click()

	// Wait for success message
	await expect(page.getByText('Check your email')).toBeVisible()
}

// Helper to simulate magic link verification
export async function verifyMagicLink(page: Page, token = 'mock-verification-token') {
	// Navigate to verification URL
	await page.goto(`/auth/verify?token=${token}`)

	// Should redirect to dashboard on success
	await expect(page).toHaveURL(/\/app/)
}

// Helper to log out
export async function logout(page: Page) {
	// Open user menu
	await page.getByTestId('user-menu-trigger').click()

	// Click logout
	await page.getByRole('menuitem', { name: 'Log out' }).click()

	// Should redirect to home or login
	await expect(page).toHaveURL(/\/(login)?$/)
}

export { expect }
