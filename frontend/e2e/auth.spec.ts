import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
	test('should display login form', async ({ page }) => {
		await page.goto('/login')

		// Check for email input
		await expect(page.getByLabel(/email/i)).toBeVisible()

		// Check for magic link button
		await expect(page.getByRole('button', { name: /send magic link/i })).toBeVisible()

		// Check for OAuth buttons
		await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
		await expect(page.getByRole('button', { name: /github/i })).toBeVisible()
	})

	test('should require email before submitting', async ({ page }) => {
		await page.goto('/login')

		// Button should be disabled when email is empty
		const submitButton = page.getByRole('button', { name: /send magic link/i })
		await expect(submitButton).toBeDisabled()
	})

	test('should show success message after requesting magic link', async ({ page }) => {
		// Mock the API response
		await page.route('**/api/v1/auth/magic-link', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: { message: 'Magic link sent' },
				}),
			})
		})

		await page.goto('/login')

		// Enter valid email
		await page.getByLabel(/email/i).fill('test@example.com')
		await page.getByRole('button', { name: /send magic link/i }).click()

		// Should show success message
		await expect(page.getByText(/check your email/i)).toBeVisible()
	})

	test('should redirect to signup page from login', async ({ page }) => {
		await page.goto('/login')

		// Click signup link
		await page.getByRole('link', { name: /sign up/i }).click()

		// Should be on signup page
		await expect(page).toHaveURL('/signup')
	})

	test('should display signup form', async ({ page }) => {
		await page.goto('/signup')

		// Check for name input
		await expect(page.getByLabel(/name/i)).toBeVisible()

		// Check for email input
		await expect(page.getByLabel(/email/i)).toBeVisible()

		// Check for signup button
		await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
	})

	test('should navigate to login from signup', async ({ page }) => {
		await page.goto('/signup')

		// Click login link
		await page.getByRole('link', { name: /log in/i }).click()

		// Should be on login page
		await expect(page).toHaveURL('/login')
	})
})
