import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUser } from '@/lib/actions'
import { ProfileContent } from './_components'

interface ProfilePageProps {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
	const { id } = await params
	const user = await getUser(id)

	if (!user) {
		return { title: 'User Not Found | RFSbase' }
	}

	const description = user.bio || `View ${user.name}'s profile and startup ideas on RFSbase`

	return {
		title: `${user.name} | RFSbase`,
		description,
		openGraph: {
			title: `${user.name} | RFSbase`,
			description,
		},
	}
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { id } = await params
	const user = await getUser(id)

	if (!user) {
		notFound()
	}

	return <ProfileContent user={user} />
}
