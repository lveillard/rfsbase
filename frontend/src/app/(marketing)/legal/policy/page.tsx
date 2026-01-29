import appConfig from '@config/app.config.json'
import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection } from '../_components/LegalPageLayout'

export const metadata: Metadata = {
	title: `Privacy Policy | ${appConfig.name}`,
	description: `How ${appConfig.name} collects, uses, and protects your data.`,
}

export default function PrivacyPolicyPage() {
	return (
		<LegalPageLayout title="Privacy Policy" lastUpdated="January 2025">
			<LegalSection title="Information We Collect">
				<p>We collect information you provide directly:</p>
				<ul>
					<li>Account information (email, display name)</li>
					<li>Content you create (ideas, comments, votes)</li>
					<li>Usage data and preferences</li>
				</ul>
			</LegalSection>

			<LegalSection title="How We Use Your Data">
				<ul>
					<li>Provide and improve the service</li>
					<li>Send relevant notifications</li>
					<li>Prevent abuse and ensure security</li>
				</ul>
			</LegalSection>

			<LegalSection title="Data Sharing">
				<p>
					We do not sell your personal information. Content you post publicly (ideas, comments) is
					visible to other users.
				</p>
			</LegalSection>

			<LegalSection title="Your Rights">
				<p>
					You can access, correct, or delete your data at any time through your account settings.
				</p>
			</LegalSection>

			<LegalSection title="Contact" last>
				<p>
					Questions? Email us at{' '}
					<a href={`mailto:privacy@${appConfig.domain}`} className="text-primary hover:underline">
						privacy@{appConfig.domain}
					</a>
				</p>
			</LegalSection>
		</LegalPageLayout>
	)
}
