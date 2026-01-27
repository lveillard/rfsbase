import appConfig from '@config/app.config.json'
import type { Metadata } from 'next'
import { Card } from '@/components/ui'

export const metadata: Metadata = {
	title: `Privacy Policy | ${appConfig.name}`,
	description: `Privacy Policy for ${appConfig.name}`,
}

export default function PrivacyPage() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
				<p className="text-text-muted mb-8">Last updated: January 2025</p>

				<Card padding="lg" className="prose prose-neutral dark:prose-invert max-w-none">
					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Introduction</h2>
						<p className="text-text-secondary mb-4">
							{appConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your
							privacy and is committed to protecting your personal data. This privacy policy
							explains how we collect, use, and protect your information when you use our service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Information We Collect</h2>

						<h3 className="font-medium mb-2 mt-4">Account Information</h3>
						<ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
							<li>Email address</li>
							<li>Display name</li>
							<li>Profile picture (optional)</li>
							<li>Bio (optional)</li>
						</ul>

						<h3 className="font-medium mb-2 mt-4">Content You Create</h3>
						<ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
							<li>Ideas and problem statements</li>
							<li>Comments and discussions</li>
							<li>Votes and interactions</li>
						</ul>

						<h3 className="font-medium mb-2 mt-4">Automatically Collected</h3>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>IP address</li>
							<li>Browser type and version</li>
							<li>Device information</li>
							<li>Usage patterns and preferences</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
						<p className="text-text-secondary mb-4">We use your information to:</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Provide and maintain the Service</li>
							<li>Personalize your experience</li>
							<li>Send notifications about activity on your content</li>
							<li>Improve the Service based on usage patterns</li>
							<li>Detect and prevent fraud or abuse</li>
							<li>Comply with legal obligations</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
						<p className="text-text-secondary mb-4">
							We do not sell your personal information. We may share your information in the
							following circumstances:
						</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>
								<strong>Public Content:</strong> Ideas and comments you post are publicly visible
							</li>
							<li>
								<strong>Service Providers:</strong> We work with trusted partners who help us
								operate the Service
							</li>
							<li>
								<strong>Legal Requirements:</strong> When required by law or to protect our rights
							</li>
							<li>
								<strong>Business Transfers:</strong> In connection with a merger or acquisition
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Data Security</h2>
						<p className="text-text-secondary mb-4">
							We implement appropriate security measures to protect your data:
						</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Encryption of data in transit (HTTPS)</li>
							<li>Secure password hashing</li>
							<li>Regular security audits</li>
							<li>Limited access to personal data</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Your Rights</h2>
						<p className="text-text-secondary mb-4">You have the right to:</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Access your personal data</li>
							<li>Correct inaccurate data</li>
							<li>Delete your account and associated data</li>
							<li>Export your data</li>
							<li>Opt out of marketing communications</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Cookies</h2>
						<p className="text-text-secondary mb-4">We use cookies and similar technologies to:</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Keep you logged in</li>
							<li>Remember your preferences</li>
							<li>Understand how you use the Service</li>
							<li>Improve performance</li>
						</ul>
						<p className="text-text-secondary mt-4">
							You can control cookies through your browser settings, but some features may not work
							properly without them.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
						<p className="text-text-secondary mb-4">
							We may use third-party services that collect and process data:
						</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Authentication providers (Google, GitHub)</li>
							<li>Analytics services</li>
							<li>Email delivery services</li>
							<li>AI/ML services for features like similar idea detection</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Data Retention</h2>
						<p className="text-text-secondary mb-4">
							We retain your data for as long as your account is active or as needed to provide the
							Service. You can delete your account at any time, and we will remove your data within
							30 days, except where retention is required by law.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Children&apos;s Privacy</h2>
						<p className="text-text-secondary mb-4">
							The Service is not intended for children under 18. We do not knowingly collect data
							from children. If you believe we have collected data from a child, please contact us.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
						<p className="text-text-secondary mb-4">
							We may update this privacy policy from time to time. We will notify you of significant
							changes by email or through the Service. Your continued use after changes constitutes
							acceptance.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-4">Contact Us</h2>
						<p className="text-text-secondary">
							If you have questions about this privacy policy or your data, please contact us at{' '}
							<a
								href={`mailto:privacy@${appConfig.domain}`}
								className="text-primary hover:underline"
							>
								privacy@{appConfig.domain}
							</a>
						</p>
					</section>
				</Card>
			</div>
		</div>
	)
}
