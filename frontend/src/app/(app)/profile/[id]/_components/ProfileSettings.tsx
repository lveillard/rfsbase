'use client'

import type { User } from '@rfsbase/shared'
import { AlertTriangle, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useState } from 'react'
import { Avatar, Button, Card, FormField, Input, Textarea, Toggle } from '@/components/ui'
import { deleteAccount, updateProfile } from '@/lib/actions'
import { signOut } from '@/lib/auth-client'

interface ProfileSettingsProps {
	readonly user: User
}

const isValidUrl = (url: string): boolean => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
	const router = useRouter()
	const [name, setName] = useState(user.name)
	const [avatar, setAvatar] = useState(user.avatar ?? '')
	const [bio, setBio] = useState(user.bio ?? '')
	const [isPublic, setIsPublic] = useState(user.isPublic)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {}
		if (!name.trim()) newErrors.name = 'Name is required'
		else if (name.length > 100) newErrors.name = 'Name must be less than 100 characters'
		if (avatar && !isValidUrl(avatar)) newErrors.avatar = 'Please enter a valid URL'
		if (bio && bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSuccessMessage(null)
		if (!validate()) return

		posthog.capture('profile_form_submitted', {
			has_avatar: !!avatar.trim(),
			has_bio: !!bio.trim(),
			is_public: isPublic,
		})

		setIsSubmitting(true)
		try {
			await updateProfile({
				name: name.trim(),
				avatar: avatar.trim() || undefined,
				bio: isPublic ? bio.trim() || undefined : undefined,
				isPublic,
			})
			setSuccessMessage('Profile updated successfully')
			router.refresh()
		} catch (error) {
			console.error('Failed to update profile:', error)
			setErrors({ name: 'Failed to update profile. Please try again.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteAccount = async () => {
		setIsDeleting(true)
		try {
			await deleteAccount()
			posthog.reset()
			await signOut()
			router.push('/')
		} catch (error) {
			console.error('Failed to delete account:', error)
			setErrors({ delete: 'Failed to delete account. Please try again.' })
			setIsDeleting(false)
		}
	}

	const hasChanges =
		name !== user.name ||
		avatar !== (user.avatar ?? '') ||
		bio !== (user.bio ?? '') ||
		isPublic !== user.isPublic

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit}>
				<Card padding="lg">
					<h2 className="text-lg font-semibold mb-6">Profile Settings</h2>

					<div className="space-y-6">
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

						<FormField label="Display Name *" error={errors.name}>
							<Input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								maxLength={100}
							/>
						</FormField>

						<FormField label="Email" hint="Email cannot be changed">
							<Input
								type="email"
								value={user.email}
								disabled
								className="bg-surface-alt text-text-muted"
							/>
						</FormField>

						<div className="flex items-center justify-between py-3 border-y border-border">
							<div>
								<p className="font-medium">Public Profile</p>
								<p className="text-sm text-text-muted">
									Allow others to see your profile and ideas
								</p>
							</div>
							<Toggle checked={isPublic} onChange={setIsPublic} />
						</div>

						<FormField
							label="Public Bio"
							error={errors.bio}
							hint={isPublic ? `${bio.length}/500 characters` : 'Enable public profile to edit'}
						>
							<Textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Tell us about yourself..."
								rows={4}
								maxLength={500}
								disabled={!isPublic}
								className={!isPublic ? 'bg-surface-alt text-text-muted' : ''}
							/>
						</FormField>

						{successMessage && (
							<div className="px-4 py-3 bg-success-muted text-success rounded-lg text-sm">
								{successMessage}
							</div>
						)}

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

			<Card padding="lg" className="border-error/30">
				<h2 className="text-lg font-semibold text-error mb-4 flex items-center gap-2">
					<AlertTriangle className="h-5 w-5" />
					Danger Zone
				</h2>

				<p className="text-sm text-text-secondary mb-4">
					Once you delete your account, there is no going back. This will permanently delete your
					profile, ideas, comments, and all associated data.
				</p>

				{errors.delete && (
					<div className="px-4 py-3 mb-4 bg-error-muted text-error rounded-lg text-sm">
						{errors.delete}
					</div>
				)}

				{!showDeleteConfirm ? (
					<Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
						Delete Account
					</Button>
				) : (
					<div className="flex items-center gap-3">
						<Button
							variant="danger"
							onClick={handleDeleteAccount}
							disabled={isDeleting}
							leftIcon={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
						>
							{isDeleting ? 'Deleting...' : 'Yes, delete my account'}
						</Button>
						<Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
							Cancel
						</Button>
					</div>
				)}
			</Card>
		</div>
	)
}
