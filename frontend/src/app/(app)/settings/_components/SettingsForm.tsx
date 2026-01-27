'use client'

import { Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Button, Card, FormField, Input, Textarea } from '@/components/ui'
import { usersApi } from '@/lib/api'

interface SettingsFormProps {
	user: {
		id: string
		name: string
		email: string
		avatar?: string
		bio?: string
	}
}

interface FormErrors {
	name?: string
	avatar?: string
	bio?: string
}

export function SettingsForm({ user }: SettingsFormProps) {
	const [name, setName] = useState(user.name)
	const [avatar, setAvatar] = useState(user.avatar ?? '')
	const [bio, setBio] = useState(user.bio ?? '')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errors, setErrors] = useState<FormErrors>({})
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const validate = (): boolean => {
		const newErrors: FormErrors = {}

		if (!name.trim()) {
			newErrors.name = 'Name is required'
		} else if (name.length > 100) {
			newErrors.name = 'Name must be less than 100 characters'
		}

		if (avatar && !isValidUrl(avatar)) {
			newErrors.avatar = 'Please enter a valid URL'
		}

		if (bio && bio.length > 500) {
			newErrors.bio = 'Bio must be less than 500 characters'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const isValidUrl = (url: string): boolean => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSuccessMessage(null)

		if (!validate()) return

		setIsSubmitting(true)
		try {
			await usersApi.update({
				name: name.trim(),
				avatar: avatar.trim() || undefined,
				bio: bio.trim() || undefined,
			})
			setSuccessMessage('Profile updated successfully')
		} catch (error) {
			console.error('Failed to update profile:', error)
			setErrors({ name: 'Failed to update profile. Please try again.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	const hasChanges =
		name !== user.name || avatar !== (user.avatar ?? '') || bio !== (user.bio ?? '')

	return (
		<form onSubmit={handleSubmit}>
			<Card padding="lg">
				<h2 className="text-lg font-semibold mb-6">Profile Settings</h2>

				<div className="space-y-6">
					{/* Avatar Preview */}
					<div className="flex items-center gap-4">
						<Avatar src={avatar || user.avatar} name={name || user.name} size="xl" />
						<div className="flex-1">
							<FormField
								label="Avatar URL"
								error={errors.avatar}
								hint="Enter a URL to your profile picture"
							>
								<Input
									type="url"
									value={avatar}
									onChange={(e) => setAvatar(e.target.value)}
									placeholder="https://example.com/avatar.jpg"
								/>
							</FormField>
						</div>
					</div>

					{/* Name */}
					<FormField label="Display Name *" error={errors.name}>
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							maxLength={100}
						/>
					</FormField>

					{/* Email (read-only) */}
					<FormField label="Email" hint="Email cannot be changed">
						<Input
							type="email"
							value={user.email}
							disabled
							className="bg-surface-alt text-text-muted"
						/>
					</FormField>

					{/* Bio */}
					<FormField label="Bio" error={errors.bio} hint={`${bio.length}/500 characters`}>
						<Textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							placeholder="Tell us about yourself..."
							rows={4}
							maxLength={500}
						/>
					</FormField>

					{/* Success Message */}
					{successMessage && (
						<div className="px-4 py-3 bg-success-muted text-success rounded-lg text-sm">
							{successMessage}
						</div>
					)}

					{/* Submit Button */}
					<div className="flex justify-end pt-4 border-t border-border">
						<Button
							type="submit"
							variant="primary"
							disabled={isSubmitting || !hasChanges}
							leftIcon={
								isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)
							}
						>
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</div>
			</Card>
		</form>
	)
}
