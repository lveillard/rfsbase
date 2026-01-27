import type { Metadata } from 'next'
import { IdeaForm } from './_components/IdeaForm'

export const metadata: Metadata = {
	title: 'Share a New Idea',
	description: 'Share a problem worth solving or a solution worth building',
}

export default function NewIdeaPage() {
	return (
		<div>
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold">Share a New Idea</h1>
				<p className="text-text-secondary mt-2">
					Describe a problem you&apos;ve experienced or a solution you&apos;d love to see
				</p>
			</div>
			<IdeaForm />
		</div>
	)
}
