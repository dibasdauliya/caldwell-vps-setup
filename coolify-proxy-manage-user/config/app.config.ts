/**
 * Application configuration
 * Central configuration file for all app settings
 */

import { env } from '@/lib/env';

export const appConfig = {
  // API Configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_SERVER_URL,
    endpoints: {
      listUsers: '/list-user',
      createUser: '/create-user',
      deleteUser: '/delete-user',
    },
    timeout: 30000, // 30 seconds
  },
  
  // Feature flags (can be extended with env vars later)
  features: {
    userManagement: true,
  },
  
  // UI Configuration
  ui: {
    toastDuration: 4000,
    maxUsersPerPage: 100,
  },
} as const;

export type AppConfig = typeof appConfig;