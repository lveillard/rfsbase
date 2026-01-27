import type { Metadata } from 'next'
import { SignupForm } from './_components/SignupForm'

export const metadata: Metadata = {
	title: 'Sign Up',
	description: 'Create your RFSbase account and start sharing startup ideas',
}

export default function SignupPage() {
	return <SignupForm />
}
