import type { Metadata } from 'next'
import { LoginForm } from './_components/LoginForm'

export const metadata: Metadata = {
	title: 'Log In',
	description: 'Sign in to your RFSbase account',
}

export default function LoginPage() {
	return <LoginForm />
}
