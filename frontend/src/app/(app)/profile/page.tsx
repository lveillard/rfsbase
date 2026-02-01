import { redirect } from 'next/navigation'
import { getSession } from '@/lib/server/auth'
import { parseId } from '@/lib/utils'

export default async function MyProfilePage() {
	const session = await getSession()

	if (!session?.user?.id) {
		redirect('/login')
	}

	redirect(`/profile/${parseId(session.user.id)}`)
}
