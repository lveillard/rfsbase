import { expect, type Page } from '@playwright/test'

export interface MockIdea {
	id: string
	title: string
	problem: string
	solution?: string
	category: string
	tags: string[]
	votes: {
		problem: number
		solution: number
		total: number
	}
	commentCount: number
	author: {
		id: string
		name: string
		avatar?: string
		verified: boolean
		ycVerified: boolean
	}
}

// Sample mock ideas for testing
export const mockIdeas: MockIdea[] = [
	{
		id: 'idea:1',
		title: 'AI-powered code review tool for small teams',
		problem:
			'Small engineering teams struggle with code review quality. Senior engineers are bottlenecked reviewing all PRs, while junior devs miss important patterns.',
		solution:
			'An AI assistant that provides first-pass review, flagging potential issues and suggesting improvements before human review.',
		category: 'devtools',
		tags: ['ai', 'code-review', 'productivity'],
		votes: { problem: 156, solution: 75, total: 231 },
		commentCount: 23,
		author: {
			id: 'user:alice',
			name: 'Alice Chen',
			verified: true,
			ycVerified: true,
		},
	},
	{
		id: 'idea:2',
		title: 'Automated compliance documentation for startups',
		problem:
			'Startups spend countless hours on compliance documentation (SOC2, HIPAA, GDPR). This is time taken away from building product.',
		solution:
			'Auto-generate compliance docs by analyzing codebase, infrastructure, and policies. Keep them updated as things change.',
		category: 'b2b-saas',
		tags: ['compliance', 'automation', 'security'],
		votes: { problem: 89, solution: 65, total: 154 },
		commentCount: 12,
		author: {
			id: 'user:bob',
			name: 'Bob Smith',
			verified: true,
			ycVerified: false,
		},
	},
	{
		id: 'idea:3',
		title: 'Better infrastructure for AI agent deployment',
		problem:
			'Deploying AI agents to production is painful. You need to handle rate limiting, fallbacks, monitoring, cost tracking, and failover.',
		category: 'ai-ml',
		tags: ['ai', 'infrastructure', 'deployment'],
		votes: { problem: 280, solution: 79, total: 359 },
		commentCount: 45,
		author: {
			id: 'user:charlie',
			name: 'Charlie Davis',
			verified: true,
			ycVerified: true,
		},
	},
]

// Helper to create an idea via UI
export async function createIdeaViaUI(
	page: Page,
	idea: {
		title: string
		problem: string
		solution?: string
		category: string
		tags?: string[]
	},
) {
	await page.goto('/app/ideas/new')

	// Fill in title
	await page.getByLabel('Title').fill(idea.title)

	// Fill in problem
	await page.getByLabel('Problem').fill(idea.problem)

	// Fill in solution if provided
	if (idea.solution) {
		await page.getByLabel('Solution').fill(idea.solution)
	}

	// Select category
	await page.getByLabel('Category').selectOption(idea.category)

	// Add tags if provided
	if (idea.tags) {
		for (const tag of idea.tags) {
			await page.getByPlaceholder('Add a tag').fill(tag)
			await page.getByPlaceholder('Add a tag').press('Enter')
		}
	}

	// Submit
	await page.getByRole('button', { name: 'Create Idea' }).click()

	// Wait for redirect to idea page
	await expect(page).toHaveURL(/\/app\/ideas\/[a-z0-9:]+/)
}

// Helper to vote on an idea
export async function voteOnIdea(page: Page, voteType: 'problem' | 'solution') {
	const buttonText = voteType === 'problem' ? 'I have this problem' : "I'd use this solution"
	await page.getByRole('button', { name: buttonText }).click()
}

// Helper to add a comment
export async function addComment(page: Page, content: string) {
	await page.getByPlaceholder('Add a comment').fill(content)
	await page.getByRole('button', { name: 'Post Comment' }).click()

	// Wait for comment to appear
	await expect(page.getByText(content)).toBeVisible()
}

export { expect }
