import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ApiResponse, api, authApi, type User } from '../api'

// Result type for auth operations
type AuthResult = { readonly success: true } | { readonly success: false; readonly error: string }

// Pure helper to extract auth result from API response
const toAuthResult = <T>(response: ApiResponse<T>, fallbackError: string): AuthResult =>
	response.success
		? { success: true }
		: { success: false, error: response.error.message || fallbackError }

// Pure helper to handle authenticated responses
const handleAuthResponse = <T extends { user: User; token: string }>(
	response: ApiResponse<T>,
	fallbackError: string,
	onSuccess: (data: T) => void,
): AuthResult => {
	if (response.success) {
		onSuccess(response.data)
		return { success: true }
	}
	return { success: false, error: response.error.message || fallbackError }
}

interface AuthState {
	readonly user: User | null
	readonly token: string | null
	readonly isLoading: boolean
	readonly isAuthenticated: boolean

	setUser: (user: User | null) => void
	setToken: (token: string | null) => void
	login: (email: string) => Promise<AuthResult>
	verifyMagicLink: (token: string) => Promise<AuthResult>
	loginWithOAuth: (provider: 'google' | 'github', code: string) => Promise<AuthResult>
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
	initialize: () => Promise<void>
}

// OAuth provider config for extensibility
const oauthProviders = {
	google: authApi.loginWithGoogle,
	github: authApi.loginWithGithub,
} as const

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => {
			const setCredentials = (user: User, token: string): void => {
				get().setToken(token)
				get().setUser(user)
			}

			return {
				user: null,
				token: null,
				isLoading: true,
				isAuthenticated: false,

				setUser: (user) => set({ user, isAuthenticated: user !== null }),

				setToken: (token) => {
					api.setToken(token)
					set({ token })
				},

				login: async (email) => {
					const response = await authApi.login(email)
					return toAuthResult(response, 'Failed to send magic link')
				},

				verifyMagicLink: async (token) => {
					const response = await authApi.verifyMagicLink(token)
					return handleAuthResponse(response, 'Invalid or expired link', ({ user, token }) =>
						setCredentials(user, token),
					)
				},

				loginWithOAuth: async (provider, code) => {
					const loginFn = oauthProviders[provider]
					const response = await loginFn(code)
					return handleAuthResponse(response, 'OAuth login failed', ({ user, token }) =>
						setCredentials(user, token),
					)
				},

				logout: async () => {
					await authApi.logout()
					get().setToken(null)
					get().setUser(null)
				},

				refreshUser: async () => {
					const response = await authApi.me()
					if (response.success) {
						get().setUser(response.data)
					}
				},

				initialize: async () => {
					const { token, setToken, setUser } = get()

					if (!token) {
						set({ isLoading: false })
						return
					}

					api.setToken(token)

					try {
						const response = await authApi.me()
						if (response.success) {
							set({
								user: response.data,
								isAuthenticated: true,
								isLoading: false,
							})
						} else {
							setToken(null)
							set({ user: null, isAuthenticated: false, isLoading: false })
						}
					} catch {
						set({ isLoading: false })
					}
				},
			}
		},
		{
			name: 'rfsbase-auth',
			partialize: (state) => ({ token: state.token }),
		},
	),
)
