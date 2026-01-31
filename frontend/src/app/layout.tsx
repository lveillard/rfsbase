import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import appConfig from '@config/app.config.json'
import { PostHogIdentify } from '@/components/PostHogIdentify'
import { QueryProvider } from '@/lib/providers'
import { ThemeProvider } from '@/lib/theme/provider'

export const metadata: Metadata = {
	title: {
		default: `${appConfig.name} - ${appConfig.tagline}`,
		template: `%s | ${appConfig.name}`,
	},
	description: appConfig.description,
	keywords: [
		'startup ideas',
		'request for startup',
		'RFS',
		'YC',
		'founders',
		'entrepreneurship',
		'startup problems',
		'startup solutions',
	],
	authors: [{ name: appConfig.name }],
	creator: appConfig.name,
	metadataBase: new URL(`https://${appConfig.domain}`),
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: `https://${appConfig.domain}`,
		siteName: appConfig.name,
		title: `${appConfig.name} - ${appConfig.tagline}`,
		description: appConfig.description,
		images: [
			{
				url: '/og/default.png',
				width: 1200,
				height: 630,
				alt: appConfig.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: `${appConfig.name} - ${appConfig.tagline}`,
		description: appConfig.description,
		creator: appConfig.social.twitter,
		images: ['/og/default.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
	},
	manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#FAFAF9' },
		{ media: '(prefers-color-scheme: dark)', color: '#0D0D0D' },
	],
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background text-text antialiased">
				<QueryProvider>
					<ThemeProvider>
						<PostHogIdentify />
						{children}
						<Toaster
							position="bottom-right"
							toastOptions={{
								className: 'bg-surface border border-border text-text',
							}}
						/>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
