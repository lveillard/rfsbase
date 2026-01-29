import { expect, test } from './fixtures/auth.fixture'
import { mockIdeas } from './fixtures/idea.fixture'

test.describe('Ideas', () => {
	test.beforeEach(async ({ page }) => {
		// Mock the ideas API
		await page.route('**/api/v1/ideas', (route) => {
			if (route.request().method() === 'GET') {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: mockIdeas,
						pagination: {
							page: 1,
							pageSize: 20,
							total: mockIdeas.length,
							totalPages: 1,
							hasNext: false,
							hasPrev: false,
						},
					}),
				})
			} else {
				route.continue()
			}
		})
	})

	test('should display ideas list page', async ({ authenticatedPage: page }) => {
		await page.goto('/ideas')

		// Should show the page heading or ideas section
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('should have new idea link', async ({ authenticatedPage: page }) => {
		await page.goto('/ideas')

		// Should have a link to create new idea
		const newIdeaLink = page.getByRole('link', { name: /new|create/i })
		await expect(newIdeaLink.first()).toBeVisible()
	})

	// Skip: requires real server-side auth (Better Auth sessions)
	test.skip('should navigate to create idea page', async ({ authenticatedPage: page }) => {
		await page.goto('/ideas')

		// Click create button
		await page
			.getByRole('link', { name: /new|create/i })
			.first()
			.click()

		// Should be on create page
		await expect(page).toHaveURL('/ideas/new')
	})
})

test.describe('Idea Detail', () => {
	test.beforeEach(async ({ page }) => {
		// Mock idea API
		await page.route('**/api/v1/ideas/*', (route) => {
			const url = route.request().url()
			if (url.includes('/comments')) {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: [],
						pagination: {
							page: 1,
							pageSize: 20,
							total: 0,
							totalPages: 0,
							hasNext: false,
							hasPrev: false,
						},
					}),
				})
			} else {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						success: true,
						data: mockIdeas[0],
					}),
				})
			}
		})
	})

	test('should load idea page', async ({ authenticatedPage: page }) => {
		await page.goto('/ideas/idea:1')

		// Should have back link to ideas list
		await expect(page.getByRole('link', { name: /back|ideas/i }).first()).toBeVisible()
	})

	test('should display loading or content', async ({ authenticatedPage: page }) => {
		await page.goto('/ideas/idea:1')

		// Page should have some content (either loading skeleton or actual content)
		await expect(page.locator('main, article, section').first()).toBeVisible()
	})
})

// Skip: Create Idea tests require real server-side auth (Better Auth sessions)
// TODO: Implement test user seeding or auth bypass for e2e tests
test.describe
	.skip('Create Idea', () => {
		test('should display create idea form', async ({ authenticatedPage: page }) => {
			await page.goto('/ideas/new')

			// Should show form heading (wizard step) - h2 with "Problem"
			await expect(page.locator('h2:has-text("Problem")')).toBeVisible()
		})

		test('should show problem textarea as first step', async ({ authenticatedPage: page }) => {
			await page.goto('/ideas/new')

			// Should show a textarea for problem description (has label "Describe the problem")
			await expect(page.getByLabel(/describe the problem/i)).toBeVisible()
		})

		test('should navigate through wizard steps', async ({ authenticatedPage: page }) => {
			await page.goto('/ideas/new')

			// Fill in problem (minimum 100 characters required)
			const textarea = page.getByLabel(/describe the problem/i)
			await textarea.fill(
				'This is a test problem that needs at least 100 characters to enable the continue button. Making it longer to meet minimum requirements.',
			)

			// Click continue
			await page.getByRole('button', { name: /continue/i }).click()

			// Should be on step 2 (Solution) - h2 with "Solution"
			await expect(page.locator('h2:has-text("Solution")')).toBeVisible()
		})
	})
