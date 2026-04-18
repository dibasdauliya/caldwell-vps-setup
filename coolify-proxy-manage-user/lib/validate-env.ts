/**
 * Environment validation check that runs on app startup
 * This file is imported early in the app to ensure env vars are validated
 * before any components that depend on them are loaded
 */

import { env, EnvironmentError } from './env';

// This will throw immediately if required env vars are missing
try {
  // Access the env object to trigger validation
  void env;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Environment variables validated successfully');
    console.log(`   SERVER_URL: ${env.NEXT_PUBLIC_SERVER_URL}`);
  }
} catch (error) {
  if (error instanceof EnvironmentError) {
    // In production, we want to fail fast and loud
    if (process.env.NODE_ENV === 'production') {
      // Log to error tracking service if configured
      console.error('CRITICAL: Environment configuration error in production');
      
      // Optionally exit the process in production
      // process.exit(1);
    }
    
    // Re-throw the error to be caught by error boundaries
    throw error;
  }
  
  // Re-throw any non-environment errors
  throw error;
}

export { env };