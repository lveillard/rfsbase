import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
	it('renders with children', () => {
		render(<Button>Click me</Button>)
		expect(screen.getByRole('button')).toHaveTextContent('Click me')
	})

	it('handles click events', () => {
		const handleClick = vi.fn()
		render(<Button onClick={handleClick}>Click me</Button>)

		fireEvent.click(screen.getByRole('button'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Click me</Button>)
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('is disabled when isLoading prop is true', () => {
		render(<Button isLoading>Click me</Button>)
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('shows loading spinner when isLoading', () => {
		render(<Button isLoading>Click me</Button>)
		// The SVG spinner should be present
		expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
	})

	it('renders with left icon', () => {
		render(<Button leftIcon={<span data-testid="left-icon">L</span>}>Click me</Button>)
		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
	})

	it('renders with right icon', () => {
		render(<Button rightIcon={<span data-testid="right-icon">R</span>}>Click me</Button>)
		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('applies primary variant styles by default', () => {
		render(<Button>Click me</Button>)
		const button = screen.getByRole('button')
		expect(button.className).toContain('bg-primary')
	})

	it('applies secondary variant styles', () => {
		render(<Button variant="secondary">Click me</Button>)
		const button = screen.getByRole('button')
		expect(button.className).toContain('bg-secondary')
	})

	it('applies outline variant styles', () => {
		render(<Button variant="outline">Click me</Button>)
		const button = screen.getByRole('button')
		expect(button.className).toContain('border')
		expect(button.className).toContain('bg-transparent')
	})

	it('applies ghost variant styles', () => {
		render(<Button variant="ghost">Click me</Button>)
		const button = screen.getByRole('button')
		expect(button.className).toContain('bg-transparent')
	})

	it('applies different sizes', () => {
		const { rerender } = render(<Button size="sm">Click me</Button>)
		expect(screen.getByRole('button').className).toContain('h-8')

		rerender(<Button size="md">Click me</Button>)
		expect(screen.getByRole('button').className).toContain('h-10')

		rerender(<Button size="lg">Click me</Button>)
		expect(screen.getByRole('button').className).toContain('h-12')
	})
})
