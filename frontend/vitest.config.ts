import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['**/*.test.{ts,tsx}'],
		exclude: ['**/e2e/**', '**/node_modules/**', '**/.next/**'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'**/node_modules/**',
				'**/*.test.{ts,tsx}',
				'**/*.d.ts',
				'**/e2e/**',
				'**/.next/**',
				'src/test/**',
				'src/types/**',
			],
			thresholds: {
				statements: 70,
				branches: 70,
				functions: 70,
				lines: 70,
			},
		},
		testTimeout: 10000,
	},
})
