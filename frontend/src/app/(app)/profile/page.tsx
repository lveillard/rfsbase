import { redirect } from 'next/navigation'
import { getSession } from '@/lib/server/auth'

export default async function MyProfilePage() {
	const session = await getSession()

	if (!session?.user?.id) {
		redirect('/login')
	}

	redirect(`/profile/${session.user.id}`)
}
