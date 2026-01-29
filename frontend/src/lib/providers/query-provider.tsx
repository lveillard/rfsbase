'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { readonly children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Default stale time: 1 minute
						staleTime: 60 * 1000,
						// Retry failed requests 2 times
						retry: 2,
						// Refetch on window focus (disable in dev for sanity)
						refetchOnWindowFocus: process.env.NODE_ENV === 'production',
						// Cancel previous in-flight requests
						refetchOnMount: 'always',
					},
					mutations: {
						// Retry mutations only for network errors
						retry: (failureCount, error) => {
							if (error instanceof Error && error.message.includes('Network')) {
								return failureCount < 2
							}
							return false
						},
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
