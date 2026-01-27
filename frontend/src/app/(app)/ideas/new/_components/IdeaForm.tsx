'use client'

import appConfig from '@config/app.config.json'
import categoriesConfig from '@config/categories.config.json'
import { Info, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge, Button, Card, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useCreateIdea } from '../../_hooks'
import { SimilarIdeas } from './SimilarIdeas'

const steps = [
	{
		id: 'problem',
		title: 'Problem',
		description: 'What problem are you solving?',
	},
	{ id: 'solution', title: 'Solution', description: 'How would you solve it?' },
	{
		id: 'details',
		title: 'Details',
		description: 'Add context and categorize',
	},
]

export function IdeaForm() {
	const router = useRouter()
	const [currentStep, setCurrentStep] = useState(0)
	const [isRefining, setIsRefining] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const { createIdea, isCreating } = useCreateIdea()

	// Form state
	const [title, setTitle] = useState('')
	const [problem, setProblem] = useState('')
	const [solution, setSolution] = useState('')
	const [targetAudience, setTargetAudience] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')
	const [links, setLinks] = useState<string[]>([])
	const [linkInput, setLinkInput] = useState('')

	const canProceed = () => {
		switch (currentStep) {
			case 0:
				return problem.length >= appConfig.limits.problemMinLength
			case 1:
				return true // Solution is optional
			case 2:
				return title.length >= appConfig.limits.titleMinLength && category
			default:
				return false
		}
	}

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

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

	const handleAddLink = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && linkInput.trim() && links.length < appConfig.limits.linksMax) {
			e.preventDefault()
			try {
				new URL(linkInput.trim())
				if (!links.includes(linkInput.trim())) {
					setLinks([...links, linkInput.trim()])
				}
				setLinkInput('')
			} catch {
				// Invalid URL
			}
		}
	}

	const handleRefineWithAI = async () => {
		setIsRefining(true)
		try {
			// TODO: Implement AI refinement
			await new Promise((resolve) => setTimeout(resolve, 2000))
		} finally {
			setIsRefining(false)
		}
	}

	const handleSubmit = async () => {
		setSubmitError(null)
		const result = await createIdea({
			title,
			problem,
			solution: solution || undefined,
			targetAudience: targetAudience || undefined,
			category,
			tags: tags.length > 0 ? tags : undefined,
			links: links.length > 0 ? links : undefined,
		})

		if (result.success) {
			router.push(`/ideas/${result.data.id}`)
		} else {
			setSubmitError(result.error)
		}
	}

	return (
		<div className="max-w-2xl mx-auto">
			{/* Progress steps */}
			<div className="flex items-center justify-between mb-8">
				{steps.map((step, index) => (
					<div key={step.id} className="flex items-center">
						<button
							type="button"
							onClick={() => index < currentStep && setCurrentStep(index)}
							disabled={index > currentStep}
							className={cn(
								'flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-colors',
								index === currentStep
									? 'bg-primary text-white'
									: index < currentStep
										? 'bg-success text-white cursor-pointer'
										: 'bg-surface-alt text-text-muted',
							)}
						>
							{index < currentStep ? '✓' : index + 1}
						</button>
						{index < steps.length - 1 && (
							<div
								className={cn(
									'w-16 sm:w-24 h-0.5 mx-2',
									index < currentStep ? 'bg-success' : 'bg-border',
								)}
							/>
						)}
					</div>
				))}
			</div>

			{/* Step content */}
			<Card padding="lg">
				<div className="mb-6">
					<h2 className="text-xl font-semibold">{steps[currentStep]?.title}</h2>
					<p className="text-text-secondary mt-1">{steps[currentStep]?.description}</p>
				</div>

				{/* Step 1: Problem */}
				{currentStep === 0 && (
					<div className="space-y-4">
						<Textarea
							label="Describe the problem"
							placeholder="What problem have you or others experienced? Be specific about who faces this problem and why it matters..."
							value={problem}
							onChange={(e) => setProblem(e.target.value)}
							maxLength={appConfig.limits.problemMaxLength}
							showCount
							hint={`Minimum ${appConfig.limits.problemMinLength} characters`}
							className="min-h-[200px]"
						/>

						{/* Similar ideas */}
						<SimilarIdeas problemText={problem} />

						{/* AI refinement */}
						{problem.length >= 100 && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefineWithAI}
								disabled={isRefining}
								leftIcon={
									isRefining ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Sparkles className="h-4 w-4" />
									)
								}
							>
								Refine with AI
							</Button>
						)}
					</div>
				)}

				{/* Step 2: Solution */}
				{currentStep === 1 && (
					<div className="space-y-4">
						<div className="flex items-start gap-2 p-3 bg-surface-alt rounded-lg text-sm text-text-secondary">
							<Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
							<p>
								A solution is optional. Sometimes it&apos;s better to just describe the problem and
								let the community brainstorm solutions.
							</p>
						</div>

						<Textarea
							label="Proposed solution (optional)"
							placeholder="How would you solve this problem? What would the ideal solution look like?"
							value={solution}
							onChange={(e) => setSolution(e.target.value)}
							maxLength={appConfig.limits.solutionMaxLength}
							showCount
							className="min-h-[200px]"
						/>

						<Textarea
							label="Target audience (optional)"
							placeholder="Who would use this solution? Be specific about the target market..."
							value={targetAudience}
							onChange={(e) => setTargetAudience(e.target.value)}
							maxLength={500}
							className="min-h-[100px]"
						/>
					</div>
				)}

				{/* Step 3: Details */}
				{currentStep === 2 && (
					<div className="space-y-6">
						<Input
							label="Title"
							placeholder="A clear, concise title for your idea"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							maxLength={appConfig.limits.titleMaxLength}
							hint={`${title.length}/${appConfig.limits.titleMaxLength} characters`}
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
												? 'border-primary bg-primary-muted'
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
							{/* Popular tag suggestions */}
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
										className="text-xs text-primary hover:underline mx-1 disabled:text-text-muted disabled:no-underline"
									>
										{tag}
									</button>
								))}
							</div>
						</div>

						<div>
							<label htmlFor="links-input" className="block text-sm font-medium mb-2">
								Links ({links.length}/{appConfig.limits.linksMax})
							</label>
							<Input
								id="links-input"
								type="url"
								placeholder="Add relevant URLs and press Enter"
								value={linkInput}
								onChange={(e) => setLinkInput(e.target.value)}
								onKeyDown={handleAddLink}
								disabled={links.length >= appConfig.limits.linksMax}
							/>
							{links.length > 0 && (
								<div className="space-y-1 mt-2">
									{links.map((link) => (
										<div key={link} className="flex items-center gap-2 text-sm text-text-secondary">
											<span className="truncate flex-1">{link}</span>
											<button
												type="button"
												onClick={() => setLinks(links.filter((l) => l !== link))}
												className="text-text-muted hover:text-error"
											>
												×
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Error display */}
				{submitError && (
					<div className="mt-4 p-3 bg-error-muted text-error rounded-lg text-sm">{submitError}</div>
				)}

				{/* Navigation */}
				<div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
					<Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
						Back
					</Button>

					{currentStep < steps.length - 1 ? (
						<Button onClick={handleNext} disabled={!canProceed()}>
							Continue
						</Button>
					) : (
						<Button
							onClick={handleSubmit}
							disabled={!canProceed() || isCreating}
							isLoading={isCreating}
						>
							Publish Idea
						</Button>
					)}
				</div>
			</Card>
		</div>
	)
}
