import appConfig from '@config/app.config.json'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import { Brand } from '../Brand'

const footerLinks = {
	product: [
		{ href: '/about', label: 'About' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/changelog', label: 'Changelog' },
	],
	resources: [
		{ href: '/docs', label: 'Documentation' },
		{ href: '/api', label: 'API' },
		{ href: '/support', label: 'Support' },
	],
	legal: [
		{ href: '/terms', label: 'Terms of Service' },
		{ href: '/privacy', label: 'Privacy Policy' },
	],
} as const

const socialLinks = [
	{
		href: `https://twitter.com/${appConfig.social.twitter.replace('@', '')}`,
		icon: Twitter,
		label: 'Twitter',
	},
	{
		href: `https://github.com/${appConfig.social.github}`,
		icon: Github,
		label: 'GitHub',
	},
] as const

interface FooterLinkSectionProps {
	title: string
	links: ReadonlyArray<{ href: string; label: string }>
}

const FooterLinkSection = ({ title, links }: FooterLinkSectionProps) => (
	<div>
		<h3 className="font-semibold text-sm mb-3">{title}</h3>
		<ul className="space-y-2">
			{links.map((link) => (
				<li key={link.href}>
					<Link
						href={link.href}
						className="text-sm text-text-secondary hover:text-text transition-colors"
					>
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	</div>
)

export function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="border-t border-border bg-surface">
			<div className="container-wide py-12">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="col-span-2 md:col-span-1">
						<div className="mb-4">
							<Brand />
						</div>
						<p className="text-sm text-text-secondary mb-4">{appConfig.description}</p>
						<div className="flex gap-3">
							{socialLinks.map(({ href, icon: Icon, label }) => (
								<a
									key={href}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-text-muted hover:text-text transition-colors"
									aria-label={label}
								>
									<Icon className="h-5 w-5" />
								</a>
							))}
						</div>
					</div>

					<FooterLinkSection title="Product" links={footerLinks.product} />
					<FooterLinkSection title="Resources" links={footerLinks.resources} />
					<FooterLinkSection title="Legal" links={footerLinks.legal} />
				</div>

				<div className="mt-12 pt-8 border-t border-border">
					<p className="text-sm text-text-muted text-center">
						&copy; {currentYear} {appConfig.name}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
