import appConfig from '@config/app.config.json'
import { Footer, Header } from '@/components/layout'

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: appConfig.name,
	description: appConfig.description,
	url: `https://${appConfig.domain}`,
	applicationCategory: 'BusinessApplication',
	operatingSystem: 'All',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
	},
	creator: {
		'@type': 'Organization',
		name: appConfig.name,
		url: `https://${appConfig.domain}`,
	},
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is static data, safe to inject
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Header variant="marketing" />
			<main className="min-h-[calc(100vh-4rem)]">{children}</main>
			<Footer />
		</>
	)
}
