/**
 * Environment variable validation and configuration
 * This module ensures all required environment variables are present
 * and throws descriptive errors if they are missing.
 */

type EnvConfig = {
  NEXT_PUBLIC_SERVER_URL: string;
};

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates that a required environment variable is present
 * @param key - The environment variable key
 * @param value - The environment variable value
 * @returns The validated value
 * @throws EnvironmentError if the value is missing or empty
 */
function validateRequiredEnv(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new EnvironmentError(
      `Missing required environment variable: ${key}\n` +
      `Please set ${key} in your .env.local file or environment.\n` +
      `Example: ${key}=https://your-server-url.com`
    );
  }
  return value.trim();
}

/**
 * Validates and returns all required environment variables
 * This function will throw an error immediately if any required env var is missing
 */
function getEnvConfig(): EnvConfig {
  try {
    return {
      NEXT_PUBLIC_SERVER_URL: validateRequiredEnv(
        'NEXT_PUBLIC_SERVER_URL',
        process.env.NEXT_PUBLIC_SERVER_URL
      ),
    };
  } catch (error) {
    if (error instanceof EnvironmentError) {
      // In development, log the error with helpful formatting
      if (process.env.NODE_ENV === 'development') {
        console.error('\n❌ Environment Configuration Error\n');
        console.error('─'.repeat(50));
        console.error(error.message);
        console.error('─'.repeat(50));
        console.error('\n');
      }
      throw error;
    }
    throw new EnvironmentError('Failed to load environment configuration');
  }
}

// Export the validated environment configuration
// This will throw immediately if required env vars are missing
export const env = getEnvConfig();

// Export individual validated values for convenience
export const SERVER_URL = env.NEXT_PUBLIC_SERVER_URL;

// Export the error class for use in other modules
export { EnvironmentError };