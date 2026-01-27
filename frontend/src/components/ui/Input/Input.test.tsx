import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
	it('renders with label', () => {
		render(<Input label="Email" name="email" />)
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
	})

	it('renders without label', () => {
		render(<Input placeholder="Enter text" />)
		expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
	})

	it('handles value changes', () => {
		const handleChange = vi.fn()
		render(<Input onChange={handleChange} />)

		const input = screen.getByRole('textbox')
		fireEvent.change(input, { target: { value: 'test' } })

		expect(handleChange).toHaveBeenCalled()
	})

	it('displays error state', () => {
		render(<Input label="Email" error="Invalid email" />)

		expect(screen.getByText('Invalid email')).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toHaveClass('border-error')
	})

	it('displays hint text', () => {
		render(<Input label="Email" hint="We'll never share your email" />)
		expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
	})

	it('is disabled when disabled prop is true', () => {
		render(<Input disabled />)
		expect(screen.getByRole('textbox')).toBeDisabled()
	})

	it('renders with left icon', () => {
		render(<Input leftIcon={<span data-testid="left-icon">@</span>} />)
		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
	})

	it('renders with right icon', () => {
		render(<Input rightIcon={<span data-testid="right-icon">!</span>} />)
		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('applies custom className', () => {
		render(<Input className="custom-class" />)
		expect(screen.getByRole('textbox')).toHaveClass('custom-class')
	})

	it('forwards ref', () => {
		const ref = vi.fn()
		render(<Input ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})

	it('supports different types', () => {
		render(<Input type="password" data-testid="password-input" />)
		expect(screen.getByTestId('password-input')).toBeInTheDocument()
	})
})
