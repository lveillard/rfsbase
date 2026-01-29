'use client'

import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Badge, Button, Card } from '@/components/ui'
import { formatNumber, parseId } from '@/lib/utils'
import { useSimilarIdeas } from '../../_hooks'

interface SimilarIdeasProps {
	problemText: string
}

export function SimilarIdeas({ problemText }: SimilarIdeasProps) {
	const [dismissed, setDismissed] = useState(false)

	const {
		ideas: similarIdeas,
		isLoading,
		error,
	} = useSimilarIdeas(problemText, {
		threshold: 0.75,
		limit: 5,
		minLength: 50,
	})

	// Reset dismissed state when problem text changes significantly
	const handleDismiss = () => {
		setDismissed(true)
	}

	if (dismissed || (similarIdeas.length === 0 && !isLoading)) {
		return null
	}

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 p-4 bg-surface-alt rounded-xl text-text-secondary">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span className="text-sm">Checking for similar ideas...</span>
			</div>
		)
	}

	if (error) {
		return null // Fail silently to not block idea creation
	}

	return (
		<Card padding="md" className="border-warning bg-warning-muted/50">
			<div className="flex items-start gap-3 mb-4">
				<div className="flex items-center justify-center h-8 w-8 rounded-full bg-warning/20 text-warning flex-shrink-0">
					<AlertTriangle className="h-4 w-4" />
				</div>
				<div>
					<h3 className="font-semibold text-warning">Similar ideas exist</h3>
					<p className="text-sm text-text-secondary mt-0.5">
						Consider adding your thoughts to an existing discussion instead of creating a duplicate.
					</p>
				</div>
			</div>

			<div className="space-y-3">
				{similarIdeas.map((idea) => (
					<div
						key={idea.id}
						data-testid="similar-idea"
						className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
					>
						<div className="flex-1 min-w-0 mr-3">
							<Link
								href={`/ideas/${parseId(idea.id)}`}
								className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
							>
								{idea.title}
							</Link>
							<div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
								<span>{formatNumber(idea.votes)} votes</span>
								<span>·</span>
								<Badge variant="primary" size="sm">
									{Math.round(idea.similarity * 100)}% match
								</Badge>
							</div>
						</div>
						<Link href={`/ideas/${parseId(idea.id)}`} target="_blank" className="flex-shrink-0">
							<Button variant="outline" size="sm">
								<ExternalLink className="h-3.5 w-3.5" />
							</Button>
						</Link>
					</div>
				))}
			</div>

			<div className="flex items-center gap-2 mt-4 pt-4 border-t border-warning/20">
				<Button variant="ghost" size="sm" onClick={handleDismiss}>
					Create anyway
				</Button>
				<span className="text-xs text-text-muted">
					Your idea might still be unique enough to warrant a new post
				</span>
			</div>
		</Card>
	)
}
