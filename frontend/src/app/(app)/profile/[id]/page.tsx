import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfileContent } from './_components'

interface ProfilePageProps {
	params: Promise<{ id: string }>
}

async function getUser(id: string) {
	const apiUrl = process.env.API_URL || 'http://localhost:3001'

	try {
		const response = await fetch(`${apiUrl}/api/v1/users/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			if (response.status === 404) return null
			throw new Error('Failed to fetch user')
		}

		const data = await response.json()
		return data.data ?? data
	} catch (error) {
		console.error('Error fetching user:', error)
		return null
	}
}

async function getUserStats(id: string) {
	const apiUrl = process.env.API_URL || 'http://localhost:3001'

	try {
		const [ideasRes, followersRes, followingRes] = await Promise.all([
			fetch(`${apiUrl}/api/v1/users/${id}/ideas`, { next: { revalidate: 60 } }),
			fetch(`${apiUrl}/api/v1/users/${id}/followers`, {
				next: { revalidate: 60 },
			}),
			fetch(`${apiUrl}/api/v1/users/${id}/following`, {
				next: { revalidate: 60 },
			}),
		])

		const [ideasData, followersData, followingData] = await Promise.all([
			ideasRes.ok ? ideasRes.json() : { data: [] },
			followersRes.ok ? followersRes.json() : { data: [] },
			followingRes.ok ? followingRes.json() : { data: [] },
		])

		const ideas = ideasData.data ?? ideasData ?? []
		const followers = followersData.data ?? followersData ?? []
		const following = followingData.data ?? followingData ?? []

		// Calculate stats from ideas
		const votesReceived = ideas.reduce(
			(sum: number, idea: { votes_total?: number }) => sum + (idea.votes_total ?? 0),
			0,
		)
		const commentsCount = ideas.reduce(
			(sum: number, idea: { comment_count?: number }) => sum + (idea.comment_count ?? 0),
			0,
		)

		return {
			ideasCount: ideas.length,
			votesReceived,
			commentsCount,
			followersCount: followers.length,
			followingCount: following.length,
		}
	} catch (error) {
		console.error('Error fetching user stats:', error)
		return {
			ideasCount: 0,
			votesReceived: 0,
			commentsCount: 0,
			followersCount: 0,
			followingCount: 0,
		}
	}
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
	const { id } = await params
	const user = await getUser(id)

	if (!user) {
		return {
			title: 'User Not Found | RFSbase',
		}
	}

	return {
		title: `${user.name} | RFSbase`,
		description: user.bio || `View ${user.name}'s profile and startup ideas on RFSbase`,
		openGraph: {
			title: `${user.name} | RFSbase`,
			description: user.bio || `View ${user.name}'s profile and startup ideas`,
		},
	}
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { id } = await params
	const [user, stats] = await Promise.all([getUser(id), getUserStats(id)])

	if (!user) {
		notFound()
	}

	return <ProfileContent profileUserId={id} user={user} stats={stats} />
}
