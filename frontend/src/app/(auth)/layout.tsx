import appConfig from '@config/app.config.json'
import { Brand } from '@/components/layout'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const currentYear = new Date().getFullYear()

	return (
		<div className="min-h-screen flex flex-col">
			<header className="h-16 flex items-center px-4">
				<Brand />
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-md">{children}</div>
			</main>

			<footer className="h-16 flex items-center justify-center text-sm text-text-muted">
				&copy; {currentYear} {appConfig.name}
			</footer>
		</div>
	)
}
