import appConfig from '@config/app.config.json'
import type { Metadata } from 'next'
import { Card } from '@/components/ui'

export const metadata: Metadata = {
	title: `Terms of Service | ${appConfig.name}`,
	description: `Terms of Service for ${appConfig.name}`,
}

export default function TermsPage() {
	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
				<p className="text-text-muted mb-8">Last updated: January 2025</p>

				<Card padding="lg" className="prose prose-neutral dark:prose-invert max-w-none">
					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
						<p className="text-text-secondary mb-4">
							By accessing or using {appConfig.name} (&quot;the Service&quot;), you agree to be
							bound by these Terms of Service. If you do not agree to these terms, please do not use
							the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
						<p className="text-text-secondary mb-4">
							{appConfig.name} is a platform for sharing and discovering startup ideas. Users can
							submit ideas, vote on ideas, and engage in discussions with other community members.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
						<p className="text-text-secondary mb-4">
							To use certain features of the Service, you must create an account. You are
							responsible for maintaining the confidentiality of your account credentials and for
							all activities that occur under your account.
						</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>You must provide accurate and complete information</li>
							<li>You must be at least 18 years old to create an account</li>
							<li>You may not share your account with others</li>
							<li>You are responsible for your account&apos;s security</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">4. User Content</h2>
						<p className="text-text-secondary mb-4">
							You retain ownership of content you submit to the Service. By submitting content, you
							grant {appConfig.name} a non-exclusive, worldwide, royalty-free license to use,
							display, and distribute your content within the Service.
						</p>
						<p className="text-text-secondary mb-4">You agree not to submit content that:</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Violates any applicable law or regulation</li>
							<li>Infringes on the rights of others</li>
							<li>Contains malicious code or spam</li>
							<li>Is misleading or fraudulent</li>
							<li>Harasses or threatens others</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
						<p className="text-text-secondary mb-4">
							Ideas shared on {appConfig.name} are public by default. We do not claim ownership of
							your ideas, but we also cannot guarantee their confidentiality. Consider seeking
							appropriate legal protections for ideas you wish to keep proprietary.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
						<p className="text-text-secondary mb-4">You may not:</p>
						<ul className="list-disc list-inside text-text-secondary space-y-2">
							<li>Attempt to gain unauthorized access to the Service</li>
							<li>Use bots or automated systems to access the Service</li>
							<li>Interfere with or disrupt the Service</li>
							<li>Create multiple accounts for manipulation</li>
							<li>Use the Service for illegal purposes</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">7. Termination</h2>
						<p className="text-text-secondary mb-4">
							We may terminate or suspend your account at any time for violations of these terms or
							for any other reason at our discretion. You may also delete your account at any time.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
						<p className="text-text-secondary mb-4">
							The Service is provided &quot;as is&quot; without warranties of any kind. We do not
							guarantee the accuracy, completeness, or usefulness of any information on the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
						<p className="text-text-secondary mb-4">
							{appConfig.name} shall not be liable for any indirect, incidental, special,
							consequential, or punitive damages arising from your use of the Service.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
						<p className="text-text-secondary mb-4">
							We may update these terms from time to time. We will notify users of significant
							changes. Continued use of the Service after changes constitutes acceptance of the new
							terms.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-4">11. Contact</h2>
						<p className="text-text-secondary">
							If you have questions about these terms, please contact us at{' '}
							<a href={`mailto:legal@${appConfig.domain}`} className="text-primary hover:underline">
								legal@{appConfig.domain}
							</a>
						</p>
					</section>
				</Card>
			</div>
		</div>
	)
}
