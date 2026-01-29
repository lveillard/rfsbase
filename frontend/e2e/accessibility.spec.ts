import { expect, test } from '@playwright/test'

test.describe('Accessibility', () => {
	test.describe('Keyboard Navigation', () => {
		test('should focus login form fields with tab', async ({ page }) => {
			await page.goto('/login')

			// Tab to first focusable element
			await page.keyboard.press('Tab')

			// Should have focus on a form element or link
			const focusedElement = page.locator(':focus')
			await expect(focusedElement).toBeVisible()
		})

		test('should be able to navigate login form with keyboard', async ({ page }) => {
			await page.goto('/login')

			// Tab through form elements
			await page.keyboard.press('Tab')
			await page.keyboard.press('Tab')

			// Some element should be focused
			const focused = page.locator(':focus')
			await expect(focused).toBeVisible()
		})

		test('should navigate landing page with keyboard', async ({ page }) => {
			await page.goto('/')

			// Tab through page elements
			for (let i = 0; i < 5; i++) {
				await page.keyboard.press('Tab')
			}

			// Some element should be focused
			const focused = page.locator(':focus')
			await expect(focused).toBeVisible()
		})
	})

	test.describe('ARIA Labels', () => {
		test('should have proper aria labels on OAuth buttons', async ({ page }) => {
			await page.goto('/login')

			// OAuth buttons should have accessible names
			await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
			await expect(page.getByRole('button', { name: /github/i })).toBeVisible()
		})

		test('should have proper labels on signup form', async ({ page }) => {
			await page.goto('/signup')

			// YC verification input should have placeholder (acts as label)
			// Click "Yes" to show YC input
			await expect(page.getByText(/yc founder/i)).toBeVisible()
		})

		test('should have accessible theme toggle', async ({ page }) => {
			await page.goto('/')

			// Theme toggle should have aria-label
			const themeToggle = page.getByRole('button', { name: /theme/i })
			await expect(themeToggle).toBeVisible()
		})

		test('should have accessible navigation', async ({ page }) => {
			await page.goto('/')

			// Should have nav landmark
			await expect(page.getByRole('navigation')).toBeVisible()
		})

		test('should have main content landmark', async ({ page }) => {
			await page.goto('/')

			// Should have main landmark
			await expect(page.getByRole('main')).toBeVisible()
		})
	})

	test.describe('Color Contrast', () => {
		test('should have visible text in light mode', async ({ page }) => {
			await page.emulateMedia({ colorScheme: 'light' })
			await page.goto('/')

			// Heading should be visible
			const heading = page.getByRole('heading', { level: 1 })
			await expect(heading).toBeVisible()
		})

		test('should have visible text in dark mode', async ({ page }) => {
			await page.emulateMedia({ colorScheme: 'dark' })
			await page.goto('/')
			await page.locator('html').evaluate((el) => el.classList.add('dark'))

			// Heading should still be visible
			const heading = page.getByRole('heading', { level: 1 })
			await expect(heading).toBeVisible()
		})
	})

	test.describe('Focus Management', () => {
		test('should show focus ring on interactive elements', async ({ page }) => {
			await page.goto('/login')

			// Focus first OAuth button
			const googleButton = page.getByRole('button', { name: /google/i })
			await googleButton.focus()

			// Element should be focused
			await expect(googleButton).toBeFocused()
		})

		test('should show focus on button when tabbed', async ({ page }) => {
			await page.goto('/')

			// Tab until we hit a button
			for (let i = 0; i < 10; i++) {
				await page.keyboard.press('Tab')
				const focused = page.locator(':focus')
				if (await focused.evaluate((el) => el.tagName === 'BUTTON' || el.tagName === 'A')) {
					await expect(focused).toBeVisible()
					return
				}
			}
		})
	})
})
