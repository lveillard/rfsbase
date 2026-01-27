import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApiClient } from './client'

describe('ApiClient', () => {
	const mockFetch = vi.fn()
	let client: ReturnType<typeof createApiClient>

	beforeEach(() => {
		global.fetch = mockFetch
		client = createApiClient('http://localhost:3001')
		mockFetch.mockReset()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('GET requests', () => {
		it('should make GET request to correct URL', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: { id: '1' } }),
			})

			await client.get('/api/test')

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:3001/api/test',
				expect.objectContaining({
					method: 'GET',
					headers: expect.objectContaining({
						'Content-Type': 'application/json',
						Accept: 'application/json',
					}),
				}),
			)
		})

		it('should include query params', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: [] }),
			})

			await client.get('/api/items', { params: { page: 1, limit: 10 } })

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:3001/api/items?page=1&limit=10',
				expect.anything(),
			)
		})

		it('should skip undefined params', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: [] }),
			})

			await client.get('/api/items', {
				params: { page: 1, filter: undefined },
			})

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:3001/api/items?page=1',
				expect.anything(),
			)
		})
	})

	describe('POST requests', () => {
		it('should make POST request with body', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: { id: '1' } }),
			})

			await client.post('/api/items', { name: 'Test' })

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:3001/api/items',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ name: 'Test' }),
				}),
			)
		})
	})

	describe('Authentication', () => {
		it('should include Authorization header when token is set', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: {} }),
			})

			client.setToken('test-token')
			await client.get('/api/protected')

			expect(mockFetch).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-token',
					}),
				}),
			)
		})

		it('should not include Authorization header when token is null', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: {} }),
			})

			client.setToken(null)
			await client.get('/api/public')

			const [, options] = mockFetch.mock.calls[0]
			expect(options.headers.Authorization).toBeUndefined()
		})
	})

	describe('Error handling', () => {
		it('should return error for non-ok response', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: () =>
					Promise.resolve({
						error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
					}),
			})

			const result = await client.get('/api/protected')

			expect(result.success).toBe(false)
			expect(result.error?.code).toBe('UNAUTHORIZED')
		})

		it('should handle network errors', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'))

			const result = await client.get('/api/test')

			expect(result.success).toBe(false)
			expect(result.error?.code).toBe('NETWORK_ERROR')
			expect(result.error?.message).toBe('Network error')
		})
	})
})
