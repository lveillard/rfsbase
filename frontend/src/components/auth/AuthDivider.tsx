interface AuthDividerProps {
	text?: string
}

export function AuthDivider({ text = 'Or continue with email' }: AuthDividerProps) {
	return (
		<div className="relative my-6">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-border" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-surface px-2 text-text-muted">{text}</span>
			</div>
		</div>
	)
}
