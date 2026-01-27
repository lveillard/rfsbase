import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
	}),
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
vi.mock('next/image', () => ({
	default: function MockImage(props: { src: string; alt: string; [key: string]: unknown }) {
		const { src, alt, ...rest } = props
		return React.createElement('img', { src, alt, ...rest })
	},
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Reset mocks between tests
beforeEach(() => {
	vi.clearAllMocks()
})
