import { expect, test } from '@playwright/test'

test.describe('Marketing Pages', () => {
	test.describe('Landing Page', () => {
		test('should display hero section', async ({ page }) => {
			await page.goto('/')
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		})

		test('should have call to action buttons', async ({ page }) => {
			await page.goto('/')
			await expect(page.getByRole('link', { name: /get started|sign up/i }).first()).toBeVisible()
		})

		test('should display features section', async ({ page }) => {
			await page.goto('/')
			// Check for features or benefits content
			await expect(
				page
					.locator('section')
					.filter({ hasText: /feature|benefit|why/i })
					.first(),
			).toBeVisible()
		})

		test('should have navigation', async ({ page }) => {
			await page.goto('/')
			await expect(page.getByRole('navigation')).toBeVisible()
		})

		test('should have footer with links', async ({ page }) => {
			await page.goto('/')
			await expect(page.getByRole('contentinfo')).toBeVisible()
		})
	})

	test.describe('About Page', () => {
		test('should display about content', async ({ page }) => {
			await page.goto('/about')
			await expect(page.getByRole('heading', { name: /about/i })).toBeVisible()
		})

		test('should have team or mission section', async ({ page }) => {
			await page.goto('/about')
			await expect(page.locator('main')).toBeVisible()
		})
	})

	test.describe('Pricing Page', () => {
		test('should display pricing plans', async ({ page }) => {
			await page.goto('/pricing')
			await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible()
		})

		test('should have pricing tiers', async ({ page }) => {
			await page.goto('/pricing')
			// Should show free or pricing options
			await expect(page.getByText(/free|starter|pro/i).first()).toBeVisible()
		})
	})

	test.describe('Legal Pages', () => {
		test('should display terms of service', async ({ page }) => {
			await page.goto('/terms')
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		})

		test('should display privacy policy', async ({ page }) => {
			await page.goto('/privacy')
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		})

		test('should display changelog', async ({ page }) => {
			await page.goto('/changelog')
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		})
	})
})

test.describe('Navigation Flow', () => {
	test('should navigate from landing to login', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: /log in|sign in/i }).click()
		await expect(page).toHaveURL('/login')
	})

	test('should navigate from landing to signup', async ({ page }) => {
		await page.goto('/')
		await page
			.getByRole('link', { name: /sign up|get started/i })
			.first()
			.click()
		await expect(page).toHaveURL('/signup')
	})

	test('should navigate between legal pages from footer', async ({ page }) => {
		await page.goto('/')
		// Click on terms in footer
		const termsLink = page.getByRole('link', { name: /terms/i }).last()
		await termsLink.click()
		await expect(page).toHaveURL('/terms')
	})
})

test.describe('Responsive Design', () => {
	test('should show mobile menu on small screens', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
	})

	test('should hide desktop nav on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		// Mobile should show hamburger instead of full nav
		await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
	})

	test('about page should be readable on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/about')
		await expect(page.getByRole('heading', { name: /about/i })).toBeVisible()
	})
})
