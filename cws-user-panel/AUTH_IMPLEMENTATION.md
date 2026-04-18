# Authentication Implementation

## Overview
This application uses a magic link authentication system where users enter their email address and receive a login link via email.

## Components

### 1. Login Page (`/app/login/page.tsx`)
- Users enter their email address
- Calls the backend `/signin-user` endpoint to send a magic link
- Shows success message after sending the email
- Handles error states for invalid/expired tokens

### 2. Magic Link Verification (`/app/api/auth/verify/route.ts`)
- Handles the magic link callback from email
- Verifies the token with backend `/signin-user/:token` endpoint
- Sets authentication cookies (httpOnly for security)
- Redirects user to their originally requested page or home

### 3. Authentication Context (`/lib/auth-context.tsx`)
- Provides authentication state throughout the app
- Manages user email and authentication status
- Handles logout functionality
- Checks authentication status on mount

### 4. Middleware (`/middleware.ts`)
- Protects routes that require authentication
- Redirects unauthenticated users to login
- Redirects authenticated users away from login page
- Preserves original URL for redirect after login

### 5. API Configuration (`/lib/api-config.ts`)
- Automatically includes authentication token in API requests
- Handles cookies for authentication
- Redirects to login on 401 responses

### 6. Profile Dropdown (`/components/profile-dropdown.tsx`)
- Shows current user email
- Provides logout button
- Uses authentication context

## Authentication Flow

1. **User visits protected page** → Middleware checks for auth token → Redirects to `/login` if not authenticated

2. **User enters email on login page** → Frontend calls `/signin-user` API → Backend sends magic link email

3. **User clicks magic link** → Browser opens `/api/auth/verify?token=xxx` → API verifies token with backend → Sets auth cookies → Redirects to app

4. **Subsequent requests** → Auth token included automatically → Backend validates token → Returns protected data

5. **Logout** → Calls `/api/auth/logout` → Clears cookies → Redirects to login

## Cookie Management

### Cookies Set:
- `auth-token`: JWT or session token (httpOnly, secure in production)
- `user_email`: User's email for display (not httpOnly)

### Cookie Security:
- HttpOnly flag prevents JavaScript access to auth token
- Secure flag ensures HTTPS-only in production
- SameSite=lax prevents CSRF attacks
- 7-day expiration for convenience

## API Endpoints Used

From the backend (coolify-proxy):
- `POST /signin-user` - Send magic link email
- `GET /signin-user/:token` - Verify magic link token
- `POST /create-user` - Create new user (if needed)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing

1. Start the backend server (coolify-proxy) on port 8000
2. Start the Next.js dev server: `npm run dev`
3. Visit http://localhost:3000
4. You should be redirected to the login page
5. Enter an email address
6. Check the backend logs for the magic link
7. Visit the magic link URL to authenticate

## Security Considerations

1. **Token Expiration**: Magic links should expire after a short period (10 minutes recommended)
2. **HTTPS Required**: In production, always use HTTPS to prevent token interception
3. **Rate Limiting**: Backend should implement rate limiting on `/signin-user` to prevent abuse
4. **Email Verification**: Consider verifying email ownership before allowing access
5. **Session Management**: Implement proper session invalidation on the backend

## Future Enhancements

1. Add "Remember me" option for longer sessions
2. Implement refresh tokens for seamless re-authentication
3. Add two-factor authentication support
4. Implement password-based login as alternative
5. Add social login providers (Google, GitHub, etc.)
6. Implement user registration flow
7. Add email verification step for new users
