import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card'

describe('Card', () => {
	it('renders with children', () => {
		render(<Card>Card content</Card>)
		expect(screen.getByText('Card content')).toBeInTheDocument()
	})

	it('applies default padding (md)', () => {
		render(<Card data-testid="card">Content</Card>)
		const card = screen.getByTestId('card')
		// Default padding is 'md' which maps to 'p-4 sm:p-6'
		expect(card.className).toContain('p-4')
	})

	it('applies sm padding', () => {
		render(
			<Card padding="sm" data-testid="card">
				Content
			</Card>,
		)
		const card = screen.getByTestId('card')
		expect(card.className).toContain('p-3')
	})

	it('applies lg padding', () => {
		render(
			<Card padding="lg" data-testid="card">
				Content
			</Card>,
		)
		const card = screen.getByTestId('card')
		expect(card.className).toContain('p-6')
	})

	it('applies none padding', () => {
		render(
			<Card padding="none" data-testid="card">
				Content
			</Card>,
		)
		const card = screen.getByTestId('card')
		// none padding should not have p- class
		expect(card.className).not.toContain('p-3')
		expect(card.className).not.toContain('p-4')
		expect(card.className).not.toContain('p-6')
	})

	it('applies custom className', () => {
		render(
			<Card className="custom-class" data-testid="card">
				Content
			</Card>,
		)
		const card = screen.getByTestId('card')
		expect(card).toHaveClass('custom-class')
	})
})

describe('CardHeader', () => {
	it('renders with children', () => {
		render(<CardHeader>Header content</CardHeader>)
		expect(screen.getByText('Header content')).toBeInTheDocument()
	})
})

describe('CardTitle', () => {
	it('renders with children', () => {
		render(<CardTitle>Title</CardTitle>)
		expect(screen.getByText('Title')).toBeInTheDocument()
	})

	it('renders as h3 by default', () => {
		render(<CardTitle>Title</CardTitle>)
		expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
	})

	it('renders as specified heading level', () => {
		render(<CardTitle as="h2">Title</CardTitle>)
		expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
	})
})

describe('CardContent', () => {
	it('renders with children', () => {
		render(<CardContent>Content</CardContent>)
		expect(screen.getByText('Content')).toBeInTheDocument()
	})
})

describe('CardFooter', () => {
	it('renders with children', () => {
		render(<CardFooter>Footer content</CardFooter>)
		expect(screen.getByText('Footer content')).toBeInTheDocument()
	})
})

describe('Card Composition', () => {
	it('renders complete card with all parts', () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Test Card</CardTitle>
				</CardHeader>
				<CardContent>This is the content</CardContent>
				<CardFooter>Footer actions</CardFooter>
			</Card>,
		)

		expect(screen.getByText('Test Card')).toBeInTheDocument()
		expect(screen.getByText('This is the content')).toBeInTheDocument()
		expect(screen.getByText('Footer actions')).toBeInTheDocument()
	})
})
