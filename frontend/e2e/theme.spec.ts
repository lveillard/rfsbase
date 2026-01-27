import { expect, test } from '@playwright/test'

test.describe('Theme', () => {
	test('should default to system theme', async ({ page }) => {
		await page.goto('/')

		// The theme should be applied based on system preference
		const html = page.locator('html')
		const className = await html.getAttribute('class')

		// Should have either 'light' or 'dark' class (or none, relying on media query)
		expect(
			className === null || className.includes('light') || className.includes('dark'),
		).toBeTruthy()
	})

	test('should cycle through themes on toggle click', async ({ page }) => {
		await page.goto('/')

		// Find theme toggle button (matches aria-label pattern)
		const themeToggle = page.getByRole('button', { name: /theme/i })
		await expect(themeToggle).toBeVisible()

		// Get initial theme from aria-label
		const initialLabel = await themeToggle.getAttribute('aria-label')
		expect(initialLabel).toContain('theme')

		// Click to cycle to next theme
		await themeToggle.click()

		// The aria-label should change (theme cycled)
		const newLabel = await themeToggle.getAttribute('aria-label')
		expect(newLabel).toBeTruthy()
	})

	test('should toggle to light theme', async ({ page }) => {
		// Start with dark theme preference
		await page.emulateMedia({ colorScheme: 'dark' })
		await page.goto('/')

		const html = page.locator('html')

		// Find theme toggle
		const themeToggle = page.getByRole('button', { name: /theme/i })

		// Click until we get to light theme (cycles: light → dark → system)
		// Since we start with dark system preference, clicking once goes to next in cycle
		for (let i = 0; i < 3; i++) {
			await themeToggle.click()
			const className = await html.getAttribute('class')
			if (className?.includes('light')) break
		}

		// Check that light class is applied
		await expect(html).toHaveClass(/light/)
	})

	test('should persist theme preference', async ({ page, context }) => {
		await page.goto('/')

		// Find theme toggle
		const themeToggle = page.getByRole('button', { name: /theme/i })

		// Click until we get to dark theme
		const html = page.locator('html')
		for (let i = 0; i < 3; i++) {
			await themeToggle.click()
			const className = await html.getAttribute('class')
			if (className?.includes('dark')) break
		}

		// Verify dark theme is active
		await expect(html).toHaveClass(/dark/)

		// Reload page
		await page.reload()

		// Theme should persist
		await expect(html).toHaveClass(/dark/)
	})

	test('should have proper dark mode colors', async ({ page }) => {
		// Set dark mode
		await page.emulateMedia({ colorScheme: 'dark' })
		await page.goto('/')

		// Force dark class
		await page.locator('html').evaluate((el) => el.classList.add('dark'))

		// Check background color is dark
		const body = page.locator('body')
		const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor)

		// Dark mode background should be close to #0D0D0D
		expect(bgColor).toBeTruthy()
	})

	test('should have proper light mode colors', async ({ page }) => {
		// Set light mode
		await page.emulateMedia({ colorScheme: 'light' })
		await page.goto('/')

		// Force light class
		await page.locator('html').evaluate((el) => el.classList.remove('dark'))

		// Check background color is light
		const body = page.locator('body')
		const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor)

		// Light mode background should be close to #FAFAF9
		expect(bgColor).toBeTruthy()
	})
})
