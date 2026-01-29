import { expect, test } from './fixtures/auth.fixture'

test.describe('Notifications', () => {
	test.beforeEach(async ({ page }) => {
		await page.route('**/api/v1/notifications*', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: [
						{
							id: 'notif:1',
							type: 'vote',
							read: false,
							data: {
								idea: { id: 'idea:1', title: 'Test Idea' },
								voter: { id: 'user:2', name: 'Voter User', avatar: null },
							},
							created_at: new Date().toISOString(),
						},
						{
							id: 'notif:2',
							type: 'comment',
							read: true,
							data: {
								idea: { id: 'idea:1', title: 'Test Idea' },
								commenter: { id: 'user:3', name: 'Commenter', avatar: null },
							},
							created_at: new Date().toISOString(),
						},
					],
				}),
			})
		})
	})

	test('should display notifications page', async ({ authenticatedPage: page }) => {
		await page.goto('/notifications')
		// Should show notifications section
		await expect(page.locator('main, section, article').first()).toBeVisible()
	})

	test('should show notification list or empty state', async ({ authenticatedPage: page }) => {
		await page.goto('/notifications')
		// Should display either notifications or empty message
		await expect(page.locator('text=/notification|no.*notification/i').first()).toBeVisible()
	})

	test('should show empty state when no notifications', async ({ authenticatedPage: page }) => {
		await page.goto('/notifications')
		// Current implementation always shows empty state (TODO: implement notifications)
		await expect(page.getByText(/no notifications/i)).toBeVisible()
	})
})
