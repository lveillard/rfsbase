import type { MetadataRoute } from 'next'
import { parseId } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rfsbase.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static marketing pages
	const staticPages = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 1,
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/login`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/signup`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		},
	]

	// Dynamic idea pages (fetch from API in production)
	let ideaPages: MetadataRoute.Sitemap = []

	try {
		const API_URL = process.env.API_URL || 'http://localhost:3001'
		const response = await fetch(`${API_URL}/api/ideas?pageSize=1000`, {
			next: { revalidate: 3600 }, // Cache for 1 hour
		})

		if (response.ok) {
			const data = await response.json()
			if (data.success && data.data) {
				ideaPages = data.data.map((idea: { id: string; updatedAt: string }) => ({
					url: `${BASE_URL}/ideas/${parseId(idea.id)}`,
					lastModified: new Date(idea.updatedAt),
					changeFrequency: 'daily' as const,
					priority: 0.6,
				}))
			}
		}
	} catch (error) {
		// Silently fail - sitemap will just have static pages
		console.error('Failed to fetch ideas for sitemap:', error)
	}

	return [...staticPages, ...ideaPages]
}
