// Override problematic types from surrealdb-better-auth
// The package ships source .ts files with type errors

declare module 'surrealdb-better-auth' {
	interface SurrealAdapterConfig {
		address: string
		username: string
		password: string
		ns: string
		db: string
	}

	export function surrealAdapter(config: SurrealAdapterConfig): unknown
}
