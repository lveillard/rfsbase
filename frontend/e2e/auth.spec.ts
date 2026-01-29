import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
	test('should display login form with OAuth buttons', async ({ page }) => {
		await page.goto('/login')

		// Check for OAuth buttons
		await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
		await expect(page.getByRole('button', { name: /github/i })).toBeVisible()

		// Check for signup link
		await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
	})

	test('should redirect to signup page from login', async ({ page }) => {
		await page.goto('/login')

		// Click signup link
		await page.getByRole('link', { name: /sign up/i }).click()

		// Should be on signup page
		await expect(page).toHaveURL('/signup')
	})

	test('should display signup form with OAuth buttons', async ({ page }) => {
		await page.goto('/signup')

		// Check for YC founder question
		await expect(page.getByText(/yc founder/i)).toBeVisible()

		// Click "No" to show OAuth buttons
		await page.getByRole('button', { name: /^no$/i }).click()

		// Check for OAuth buttons
		await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
		await expect(page.getByRole('button', { name: /github/i })).toBeVisible()
	})

	test('should navigate to login from signup', async ({ page }) => {
		await page.goto('/signup')

		// Click login link
		await page.getByRole('link', { name: /log in/i }).click()

		// Should be on login page
		await expect(page).toHaveURL('/login')
	})
})
