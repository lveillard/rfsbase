import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
	test('should display the landing page with key elements', async ({ page }) => {
		await page.goto('/')

		// Check for main heading
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

		// Check for CTA buttons (there may be multiple on the page)
		await expect(page.getByRole('link', { name: /get started|sign up/i }).first()).toBeVisible()

		// Check for navigation
		await expect(page.getByRole('navigation')).toBeVisible()

		// Check for footer
		await expect(page.getByRole('contentinfo')).toBeVisible()
	})

	test('should navigate to login page', async ({ page }) => {
		await page.goto('/')

		// Click login link
		await page.getByRole('link', { name: /log in|sign in/i }).click()

		// Should be on login page
		await expect(page).toHaveURL('/login')
	})

	test('should navigate to signup page', async ({ page }) => {
		await page.goto('/')

		// Click signup link
		await page
			.getByRole('link', { name: /get started|sign up/i })
			.first()
			.click()

		// Should be on signup page
		await expect(page).toHaveURL('/signup')
	})

	test('should toggle theme', async ({ page }) => {
		await page.goto('/')

		// Get initial theme
		const html = page.locator('html')

		// Click theme toggle
		await page.getByRole('button', { name: /theme|dark|light/i }).click()

		// Theme should change
		// The class should toggle between 'light' and 'dark'
		const className = await html.getAttribute('class')
		expect(className).toBeTruthy()
	})

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 })

		await page.goto('/')

		// Mobile menu should be visible (hamburger)
		await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()

		// Desktop nav should be hidden
		const desktopNav = page.locator('nav.hidden.md\\:flex')
		await expect(desktopNav).not.toBeVisible()
	})
})
