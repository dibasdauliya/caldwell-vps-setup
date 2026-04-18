# Testing Unauthorized Display

## Setup
1. The Next.js app is running on http://localhost:3000
2. A mock server is running on http://localhost:8000

## Test Scenarios

### Scenario 1: Invalid Token
1. Open http://localhost:3000
2. Enter any token except "valid-token-123" (e.g., "invalid-token")
3. Click "Access Dashboard"
4. **Expected Result**: The page should display "Unauthorized" message in the center of the page

### Scenario 2: Valid Token
1. Open http://localhost:3000
2. Enter token "valid-token-123"
3. Click "Access Dashboard"
4. **Expected Result**: The user management dashboard should be displayed with a list of users

## Implementation Details

### Changes Made:
1. Added `isUnauthorized` state to track authorization failures
2. Modified `createDataLayer` to accept `setIsUnauthorized` function
3. Updated all API error handlers to set unauthorized state on 401/403 responses
4. Added UI component to display "Unauthorized" message centered on the page when `isUnauthorized` is true

### Files Modified:
- `/components/user-management.tsx` - Added unauthorized state and display logic

## Mock Server Details
- Valid token: "valid-token-123"
- Invalid tokens return HTTP 401 status
- Server runs on port 8000