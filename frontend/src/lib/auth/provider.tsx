'use client'

import { createContext, type ReactNode, useContext, useEffect } from 'react'
import type { User } from '../api'
import { useAuthStore } from './store'

// Auth result type for consistent error handling
type AuthResult = { readonly success: true } | { readonly success: false; readonly error: string }

type OAuthProvider = 'google' | 'github'

interface AuthContextType {
	readonly user: User | null
	readonly isLoading: boolean
	readonly isAuthenticated: boolean
	readonly login: (email: string) => Promise<AuthResult>
	readonly verifyMagicLink: (token: string) => Promise<AuthResult>
	readonly loginWithOAuth: (provider: OAuthProvider, code: string) => Promise<AuthResult>
	readonly logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
	readonly children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const store = useAuthStore()

	// Initialize auth on mount
	useEffect(() => {
		store.initialize()
	}, [store.initialize])

	const contextValue: AuthContextType = {
		user: store.user,
		isLoading: store.isLoading,
		isAuthenticated: store.isAuthenticated,
		login: store.login,
		verifyMagicLink: store.verifyMagicLink,
		loginWithOAuth: store.loginWithOAuth,
		logout: store.logout,
	}

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 * Throws if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)

	if (context === null) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}

/**
 * Hook to get current user - convenience wrapper
 * Returns null if not authenticated
 */
export function useCurrentUser(): User | null {
	return useAuth().user
}

/**
 * Hook to check authentication status
 * Useful for guards and conditional rendering
 */
export function useIsAuthenticated(): boolean {
	return useAuth().isAuthenticated
}
