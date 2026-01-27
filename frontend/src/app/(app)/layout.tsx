import { AppShell } from './_components'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <AppShell>{children}</AppShell>
}
