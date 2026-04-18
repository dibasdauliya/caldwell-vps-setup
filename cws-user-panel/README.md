# Coolify Proxy Frontend

This is the frontend application for the Coolify Proxy system. It provides a web interface to manage projects, applications, databases, and environment variables.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API server running (default: http://localhost:8000)

## Setup

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Configure the backend API URL:
   - Copy the `.env.local.example` to `.env.local` (if exists) or create `.env.local`
   - Set the backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Integration

The frontend is configured to connect to the backend API specified in the Bruno export file (`coolify-proxy.json`). The API routes are proxied through Next.js API routes located in `/app/api/`.

### API Endpoints

The following endpoints are integrated:

#### Projects
- `GET /list-project` - List all projects
- `POST /create-project` - Create a new project
- `GET /get-project/:uuid` - Get project details
- `DELETE /delete-project/:uuid` - Delete a project

#### Applications
- `GET /list-application/:project_id` - List applications in a project
- `POST /create-application` - Create a new application
- `GET /get-application/:uuid` - Get application details
- `POST /update-application/:uuid` - Update an application
- `DELETE /delete-application/:uuid` - Delete an application
- `POST /start-application/:uuid` - Start an application

#### Databases
- `GET /list-database/:project_id` - List databases in a project
- `POST /create-database-mongo` - Create a MongoDB database
- `GET /get-database/:uuid` - Get database details
- `DELETE /delete-database/:uuid` - Delete a database
- `GET /start-database/:uuid` - Start a database

#### Environment Variables
- `GET /list-env/:app_uuid` - List environment variables for an app
- `POST /create-env-bulk/:app_uuid` - Create environment variables in bulk
- `PATCH /update-env/:app_uuid` - Update an environment variable
- `DELETE /delete-env/:app_uuid/:env_uuid` - Delete an environment variable

#### Users/Authentication (To be implemented)
- `POST /create-user` - Create a new user
- `GET /list-user` - List users
- `DELETE /delete-user/:email` - Delete a user
- `POST /signin-user` - Sign in a user
- `GET /signin-user/:token` - Sign in with token

## Features

- **Project Management**: Create, view, and delete projects
- **Application Management**: Deploy applications from Git repositories with different build packs
- **Database Management**: Create and manage MongoDB, PostgreSQL, and Redis databases
- **Environment Variables**: Manage environment variables for applications
- **Real-time Status**: View and control application status (start/stop/restart)

## Architecture

The frontend uses:
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **API Routes** as a proxy layer to the backend

## Development

### Project Structure
```
/app
  /api          # Next.js API routes (backend proxy)
  page.tsx      # Main application page
  layout.tsx    # Root layout
  providers.tsx # Context providers

/components     # React components
  /ui           # shadcn/ui components
  *.tsx         # Feature components

/lib
  api-config.ts # Backend API configuration
  utils.ts      # Utility functions
```

### Adding New Features

1. Update the API configuration in `/lib/api-config.ts`
2. Create/update the API route in `/app/api/`
3. Update the relevant component in `/components/`

## Troubleshooting

### Backend Connection Issues
- Verify the backend is running on the configured port
- Check the `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure the backend endpoints match those in `coolify-proxy.json`

### Development Issues
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

## License

[Your License Here]