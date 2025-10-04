# @elsie/server

Express.js backend API server for the Elsie platform.

## 🚀 Features

- **Express 5** - Modern Node.js web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Database with Drizzle ORM
- **JWT Authentication** - Secure token-based auth
- **CORS** - Cross-origin resource sharing
- **Environment Validation** - Runtime config validation with Zod
- **Hot Reload** - Fast development with tsx watch mode

## 🏗️ Project Structure

```
src/
├── constants/        # Configuration and constants
│   └── config.ts     # Environment variables with validation
├── libs/            # Shared libraries
│   └── db.ts        # Database connection (Drizzle + PostgreSQL)
├── index.ts         # Application entry point
└── type.d.ts        # Global type definitions
```

## 🔧 Getting Started

### Prerequisites

- Node.js 22.20.0 (managed via Volta)
- PostgreSQL database
- pnpm package manager

### Environment Setup

Create a `.env` file in the package root:

```env
# Server
PORT=3000
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRED=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRED=7d
```

### Development

```bash
# Start development server with hot reload (from package root)
pnpm dev

# Or run from monorepo root (runs all packages)
cd ../.. && pnpm dev
# 🟡 [models] - TypeScript watch mode (auto-rebuilds)
# 🔵 [server] - Express API with hot reload
# 🟢 [client] - Vite dev server with HMR

# Build for production
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🔄 Hot Reload

The server uses `tsx --watch` which automatically:

- ✅ Restarts the server when source files change
- ✅ Preserves output for easier debugging
- ✅ Picks up changes from `@elsie/models` automatically

No need to manually restart or rebuild during development!

## 📦 Tech Stack

### Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **drizzle-orm** - TypeScript ORM
- **pg** - PostgreSQL client
- **jsonwebtoken** - JWT implementation
- **dotenv** - Environment variable loader
- **@elsie/models** - Shared types and schemas

### Dev Dependencies

- **tsx** - TypeScript execution and watch mode
- **drizzle-kit** - Database migrations
- **tsc-alias** - Path alias resolution
- **rimraf** - Cross-platform file deletion
- **@types/\*** - TypeScript type definitions

## 🗄️ Database

This server uses Drizzle ORM with PostgreSQL. The database connection is configured in `src/libs/db.ts`.

```typescript
import { db } from './libs/db'

// Use db instance for queries
const result = await db.query.users.findMany()
```

## 🔗 Integration with Models

The server imports types and schemas from `@elsie/models`:

```typescript
import { serverConfigSchema, type Course } from '@elsie/models'

// Environment validation
const config = serverConfigSchema.parse(process.env)
```

During development, changes to `@elsie/models` trigger:

1. TypeScript watch rebuilds the models package
2. Server detects changes and automatically restarts
3. New types are immediately available

## 🔐 Authentication

JWT-based authentication with access and refresh tokens:

- **Access Token** - Short-lived token for API requests
- **Refresh Token** - Long-lived token for renewing access

Configuration is validated via `@elsie/models/serverConfigSchema`.

## 🌐 API Endpoints

The server runs on `http://localhost:3000` by default.

CORS is configured to accept requests from `http://localhost:5173` (client app).

## 🏃 Running in Production

```bash
# Build the application
pnpm build

# Start production server
node dist/index.js
```

Make sure all environment variables are properly set in production.

## 🔗 Related Packages

- **@elsie/models** - Shared types and validation schemas
- **@elsie/client** - Frontend application
