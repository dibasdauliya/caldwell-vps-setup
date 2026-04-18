/**
 * Standardized error messages for consistent user communication
 */

export const ErrorMessages = {
  // API Errors
  FETCH_FAILED: 'Failed to fetch data',
  FETCH_FAILED_WITH_DETAIL: (detail: string) => `Failed to fetch: ${detail}`,
  
  // Resource-specific errors
  PROJECTS_FAILED: 'Error loading projects',
  PROJECT_FAILED: 'Error loading project details',
  RESOURCES_FAILED: 'Error loading project resources',
  
  // Delete errors
  DELETE_PROJECT_FAILED: 'Failed to delete project',
  DELETE_PROJECT_HAS_RESOURCES: 'Cannot delete project with active resources. Please delete all applications and databases first.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const

export function getErrorMessage(error: Error | unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return ErrorMessages.UNKNOWN_ERROR
}
