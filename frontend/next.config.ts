import type { NextConfig } from 'next'

const securityHeaders = [
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'X-DNS-Prefetch-Control', value: 'on' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=()',
	},
]

const imageRemotePatterns = [
	{ protocol: 'https' as const, hostname: 'avatars.githubusercontent.com' },
	{ protocol: 'https' as const, hostname: '*.googleusercontent.com' },
]

const nextConfig: NextConfig = {
	reactStrictMode: true,

	// React Compiler - stable in Next.js 16
	reactCompiler: true,

	images: {
		remotePatterns: imageRemotePatterns,
	},

	transpilePackages: ['@rfsbase/shared'],

	env: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
	},

	async headers() {
		return [{ source: '/(.*)', headers: securityHeaders }]
	},

	async redirects() {
		return [{ source: '/app', destination: '/app/ideas', permanent: true }]
	},
}

export default nextConfig
