import appConfig from '@config/app.config.json'
import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection } from '../_components/LegalPageLayout'

export const metadata: Metadata = {
	title: `Terms & Conditions | ${appConfig.name}`,
	description: `Terms and conditions for using ${appConfig.name}.`,
}

export default function TermsConditionsPage() {
	return (
		<LegalPageLayout title="Terms & Conditions" lastUpdated="January 2025">
			<LegalSection title="Acceptance of Terms">
				<p>
					By using {appConfig.name}, you agree to these terms. If you do not agree, please do not
					use the service.
				</p>
			</LegalSection>

			<LegalSection title="The Service">
				<p>
					{appConfig.name} is a platform for sharing and discovering startup ideas. Users can submit
					ideas, vote, and engage in discussions.
				</p>
			</LegalSection>

			<LegalSection title="User Accounts">
				<ul>
					<li>You must provide accurate information</li>
					<li>You must be at least 18 years old</li>
					<li>You are responsible for your account security</li>
				</ul>
			</LegalSection>

			<LegalSection title="User Content">
				<p>
					You retain ownership of content you submit. By posting, you grant us a license to display
					it within the service. Do not post content that violates laws or rights of others.
				</p>
			</LegalSection>

			<LegalSection title="Prohibited Activities">
				<ul>
					<li>Unauthorized access attempts</li>
					<li>Automated scraping or bots</li>
					<li>Service disruption</li>
					<li>Account manipulation</li>
				</ul>
			</LegalSection>

			<LegalSection title="Disclaimer">
				<p>
					The service is provided &quot;as is&quot; without warranties. We are not liable for
					indirect damages arising from use of the service.
				</p>
			</LegalSection>

			<LegalSection title="Contact" last>
				<p>
					Questions? Email us at{' '}
					<a href={`mailto:legal@${appConfig.domain}`} className="text-primary hover:underline">
						legal@{appConfig.domain}
					</a>
				</p>
			</LegalSection>
		</LegalPageLayout>
	)
}
