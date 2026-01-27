import { TypeCompiler } from '@sinclair/typebox/compiler'
import type { ValueError } from '@sinclair/typebox/compiler'
import type { TSchema, Static } from '@sinclair/typebox'

// Create a compiled validator for a schema
export function createValidator<T extends TSchema>(schema: T) {
  const compiled = TypeCompiler.Compile(schema)

  return {
    // Check if value is valid
    check(value: unknown): value is Static<T> {
      return compiled.Check(value)
    },

    // Validate and return errors
    validate(value: unknown): { valid: boolean; errors: ValueError[] } {
      const errors = [...compiled.Errors(value)]
      return {
        valid: errors.length === 0,
        errors
      }
    },

    // Validate and throw on error
    assert(value: unknown): asserts value is Static<T> {
      const errors = [...compiled.Errors(value)]
      if (errors.length > 0) {
        const messages = errors.map(e => `${e.path}: ${e.message}`).join(', ')
        throw new ValidationError(messages, errors)
      }
    },

    // Parse and validate, returning typed value or throwing
    parse(value: unknown): Static<T> {
      const errors = [...compiled.Errors(value)]
      if (errors.length > 0) {
        const messages = errors.map(e => `${e.path}: ${e.message}`).join(', ')
        throw new ValidationError(messages, errors)
      }
      return value as Static<T>
    },

    // Safe parse that returns result object
    safeParse(value: unknown): SafeParseResult<Static<T>> {
      const errors = [...compiled.Errors(value)]
      if (errors.length > 0) {
        return {
          success: false,
          error: new ValidationError(
            errors.map(e => `${e.path}: ${e.message}`).join(', '),
            errors
          )
        }
      }
      return {
        success: true,
        data: value as Static<T>
      }
    }
  }
}

// Custom validation error
export class ValidationError extends Error {
  public readonly errors: ValueError[]

  constructor(message: string, errors: ValueError[]) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors.map(e => ({
        path: e.path,
        message: e.message,
        value: e.value
      }))
    }
  }
}

// Safe parse result type
export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError }

// Helper to create validation middleware for API routes
export function validateBody<T extends TSchema>(schema: T) {
  const validator = createValidator(schema)
  return (body: unknown): Static<T> => {
    return validator.parse(body)
  }
}

// Helper to create validation for query params
export function validateQuery<T extends TSchema>(schema: T) {
  const validator = createValidator(schema)
  return (query: unknown): Static<T> => {
    return validator.parse(query)
  }
}

// Format validation errors for API response
export function formatValidationErrors(errors: ValueError[]): Array<{
  field: string
  message: string
}> {
  return errors.map(error => ({
    field: error.path.replace(/^\//, '').replace(/\//g, '.'),
    message: error.message
  }))
}
