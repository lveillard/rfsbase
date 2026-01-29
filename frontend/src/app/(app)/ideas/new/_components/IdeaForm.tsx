'use client'

import appConfig from '@config/app.config.json'
import categoriesConfig from '@config/categories.config.json'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, Textarea } from '@/components/ui'
import { cn, parseId } from '@/lib/utils'
import { useCreateIdea } from '../../_hooks'

export function IdeaForm() {
	const router = useRouter()
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { mutate: createIdea, isPending: isCreating, error, data: createdIdea } = useCreateIdea()

	// Form state
	const [title, setTitle] = useState('')
	const [problem, setProblem] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')

	const canSubmit =
		title.length >= appConfig.limits.titleMinLength &&
		problem.length >= appConfig.limits.problemMinLength &&
		category

	const handleAddTag = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && tagInput.trim() && tags.length < appConfig.limits.tagsMax) {
			e.preventDefault()
			const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
			if (!tags.includes(newTag)) {
				setTags([...tags, newTag])
			}
			setTagInput('')
		}
	}

	const handleRemoveTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		createIdea({
			title,
			problem,
			category,
			tags: tags.length > 0 ? tags : undefined,
		})
	}

	useEffect(() => {
		if (createdIdea) {
			router.push(`/ideas/${parseId(createdIdea.id)}`)
		}
		if (error) {
			setSubmitError(error.message)
		}
	}, [createdIdea, error, router])

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
			<Card padding="lg" className="space-y-6">
				<Input
					label="Title"
					placeholder="A clear, concise title for your idea"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					maxLength={appConfig.limits.titleMaxLength}
					hint={`${title.length}/${appConfig.limits.titleMaxLength}`}
					required
				/>

				<Textarea
					label="Problem"
					placeholder="What problem needs solving? Be specific about who faces this and why it matters..."
					value={problem}
					onChange={(e) => setProblem(e.target.value)}
					maxLength={appConfig.limits.problemMaxLength}
					showCount
					hint={`Minimum ${appConfig.limits.problemMinLength} characters`}
					className="min-h-[150px]"
					required
				/>

				<fieldset>
					<legend className="block text-sm font-medium mb-2">Category</legend>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{categoriesConfig.categories.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => setCategory(cat.id)}
								className={cn(
									'flex items-center gap-2 p-3 rounded-lg border text-left transition-colors',
									category === cat.id
										? 'border-accent bg-accent-muted'
										: 'border-border hover:border-border-hover',
								)}
							>
								<span
									className="h-3 w-3 rounded-full flex-shrink-0"
									style={{ backgroundColor: cat.color }}
								/>
								<span className="text-sm font-medium truncate">{cat.label}</span>
							</button>
						))}
					</div>
				</fieldset>

				<div>
					<label htmlFor="tags-input" className="block text-sm font-medium mb-2">
						Tags ({tags.length}/{appConfig.limits.tagsMax})
					</label>
					<Input
						id="tags-input"
						placeholder="Add tags and press Enter"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={handleAddTag}
						disabled={tags.length >= appConfig.limits.tagsMax}
					/>
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-2">
							{tags.map((tag) => (
								<Badge
									key={tag}
									variant="secondary"
									className="cursor-pointer"
									onClick={() => handleRemoveTag(tag)}
								>
									{tag} ×
								</Badge>
							))}
						</div>
					)}
					<div className="mt-2">
						<span className="text-xs text-text-muted">Popular: </span>
						{categoriesConfig.popularTags.slice(0, 5).map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => {
									if (!tags.includes(tag) && tags.length < appConfig.limits.tagsMax) {
										setTags([...tags, tag])
									}
								}}
								disabled={tags.includes(tag) || tags.length >= appConfig.limits.tagsMax}
								className="text-xs text-accent hover:underline mx-1 disabled:text-text-muted disabled:no-underline"
							>
								{tag}
							</button>
						))}
					</div>
				</div>

				{submitError && (
					<div className="p-3 bg-error-muted text-error rounded-lg text-sm">{submitError}</div>
				)}

				<Button type="submit" disabled={!canSubmit || isCreating} isLoading={isCreating} className="w-full">
					Publish Idea
				</Button>
			</Card>
		</form>
	)
}
