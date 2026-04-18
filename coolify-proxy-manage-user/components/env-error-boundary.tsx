'use client';

import React from 'react';
import { EnvironmentError } from '@/lib/env';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class EnvErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Environment Error Caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const isEnvError = this.state.error instanceof EnvironmentError ||
                        this.state.error.name === 'EnvironmentError';

      if (isEnvError) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-2xl w-full space-y-4">
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-lg font-semibold">
                  Environment Configuration Error
                </AlertTitle>
                <AlertDescription className="mt-4 space-y-4">
                  <p className="text-sm">
                    The application cannot start because required environment variables are missing.
                  </p>
                  
                  <div className="bg-destructive/10 p-4 rounded-md font-mono text-xs overflow-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.error.message}
                    </pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">To fix this issue:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root</li>
                      <li>Add the missing environment variables</li>
                      <li>Restart your development server</li>
                    </ol>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-semibold mb-2">Example .env.local:</p>
                    <code className="text-xs block bg-background p-2 rounded">
                      NEXT_PUBLIC_SERVER_URL=https://your-api-server.com
                    </code>
                  </div>
                </AlertDescription>
              </Alert>

              {process.env.NODE_ENV === 'development' && (
                <Alert>
                  <AlertTitle className="text-sm">Development Mode</AlertTitle>
                  <AlertDescription className="text-xs mt-2">
                    You are seeing this detailed error because you are in development mode.
                    In production, a generic error message would be shown to users.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        );
      }

      // For non-environment errors, show a generic error message
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription className="mt-2">
              An unexpected error occurred. Please refresh the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}