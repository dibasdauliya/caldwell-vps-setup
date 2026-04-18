# Coolify Proxy API

A REST API proxy for Coolify that provides authenticated access to manage applications, databases, and projects with user isolation and JWT-based authentication.

## Features

- Multi-tenant user management with project isolation
- JWT-based authentication via cookies
- Full CRUD operations for applications, databases, and projects
- Environment variable management for applications
- Resource lifecycle control (start/stop/restart)
- Email notifications via Resend
- Input validation with Zod schemas

## Prerequisites

- Deno runtime
- PostgreSQL database
- Coolify instance with API access
- Resend API key for emails

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coolify-proxy
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure `.env`:
```
COOLIFY_BASE_URL=https://your-coolify-instance.com
COOLIFY_ACCESS_TOKEN=your_coolify_api_token
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret_key
PRIV_TOKEN=your_privileged_access_token
```

## Usage

Start the server:
```bash
deno task dev    # Development with auto-reload
deno task start  # Production
```

Server runs on `http://localhost:8000`

## Architecture

The API acts as a proxy between clients and Coolify, adding:
- User authentication and session management
- Project-based resource isolation
- Persistent metadata storage in PostgreSQL
- Request validation and error handling

Key components:
- `src/coolify/` - Coolify API client wrappers
- `src/routes/` - HTTP endpoint handlers
- `src/system_database/` - PostgreSQL data layer
- `src/email/` - Email service integration

## API Endpoints

All endpoints except `/create-user` and `/signin-user` require JWT authentication via `auth-token` cookie.

### Authentication
- `POST /signin-user` - Sign in and receive JWT

### Applications
- `POST /create-application` - Deploy application
- `GET /get-application/:uuid` - Get details
- `GET /list-application` - List user's applications
- `DELETE /delete-application/:uuid` - Remove application
- `POST /start-application/:uuid` - Start application
- `POST /stop-application/:uuid` - Stop application
- `POST /restart-application/:uuid` - Restart application

### Environment Variables
- `GET /list-env/:application_uuid` - List variables
- `POST /create-env` - Add variable
- `POST /create-env-bulk` - Add variables
- `PUT /update-env` - Update variable
- `DELETE /delete-env` - Remove variable

### Databases
- `POST /create-database-<postgresql/mongodb/redis>` - Create database
- `GET /get-database/:uuid` - Get details
- `GET /list-database` - List user's databases
- `DELETE /delete-database/:uuid` - Remove database
- `POST /start-database/:uuid` - Start database
- `POST /stop-database/:uuid` - Stop database
- `POST /restart-database/:uuid` - Restart database

### Projects
- `POST /create-project` - Create project
- `GET /get-project/:uuid` - Get details
- `GET /list-project` - List user's projects
- `DELETE /delete-project/:uuid` - Remove project

### Admin
- `POST /create-user` - Register new user
- `GET /list-user` - List all users
- `DELETE /delete-user/:id` - Remove user

## Database Schema

PostgreSQL tables:
- `users` - User accounts with email authentication
- `projects` - User-owned project containers
- `applications` - Deployed applications linked to projects
- `databases` - Database instances (MongoDB, PostgreSQL, Redis) linked to projects

## Development

### Dependencies
- Hono - Web framework
- Zod - Schema validation
- PostgreSQL driver
- Resend - Email service
- JWT - Authentication

### Import Aliases
- `@coolify/` - Coolify API client
- `@routes/` - Route handlers
- `@sysdb/` - Database operations
- `@utils/` - Utilities

### Scripts
```bash
deno task dev    # Development server with watch mode
deno task start  # Production server
```

## Security

- JWT tokens expire and must be refreshed
- All Coolify operations are scoped to authenticated user's projects
- Admin operations require additional `PRIV_TOKEN` header
- Input validation on all endpoints
- Environment variables for sensitive configuration
